-- ============================================
-- PHASE 5: ENTERPRISE HRMS DATABASE SCHEMA
-- ============================================

-- ============================================
-- 1. ASSET MANAGEMENT TABLES
-- ============================================

-- Assets table (Laptops, Monitors, ID Cards, etc.)
CREATE TABLE IF NOT EXISTS assets (
  id SERIAL PRIMARY KEY,
  asset_type VARCHAR(50) NOT NULL,
  asset_name VARCHAR(255) NOT NULL,
  serial_number VARCHAR(100) UNIQUE,
  model VARCHAR(100),
  purchase_date DATE,
  purchase_cost DECIMAL(10, 2),
  status VARCHAR(50) DEFAULT 'Available',
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Asset allocations (which employee has which asset)
CREATE TABLE IF NOT EXISTS asset_allocations (
  id SERIAL PRIMARY KEY,
  asset_id INTEGER REFERENCES assets(id) ON DELETE CASCADE,
  employee_id INTEGER REFERENCES employee_profiles(id) ON DELETE CASCADE,
  allocated_date DATE DEFAULT CURRENT_DATE,
  returned_date DATE,
  condition_on_allocation VARCHAR(50) DEFAULT 'Good',
  condition_on_return VARCHAR(50),
  notes TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Asset history (tracking changes)
CREATE TABLE IF NOT EXISTS asset_history (
  id SERIAL PRIMARY KEY,
  asset_id INTEGER REFERENCES assets(id) ON DELETE CASCADE,
  action VARCHAR(50),
  old_status VARCHAR(50),
  new_status VARCHAR(50),
  performed_by INTEGER REFERENCES users(id),
  action_details TEXT,
  action_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 2. NOTIFICATION SYSTEM TABLES
-- ============================================

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  notification_type VARCHAR(50),
  related_entity_type VARCHAR(50),
  related_entity_id INTEGER,
  is_read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMP,
  action_url VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Notification preferences
CREATE TABLE IF NOT EXISTS notification_preferences (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  email_on_leave_approval BOOLEAN DEFAULT TRUE,
  email_on_asset_allocation BOOLEAN DEFAULT TRUE,
  in_app_notifications BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id)
);

-- ============================================
-- 3. AUDIT TRAIL TABLE (JSONB)
-- ============================================

-- Audit logs with JSONB for flexible schema
CREATE TABLE IF NOT EXISTS audit_logs (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  entity_type VARCHAR(100),
  entity_id INTEGER,
  action VARCHAR(50),
  old_values JSONB,
  new_values JSONB,
  changes JSONB,
  ip_address VARCHAR(50),
  performed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  additional_data JSONB
);

-- ============================================
-- 4. ADVANCED POSTGRESQL VIEWS
-- ============================================

-- Active asset allocations view
CREATE OR REPLACE VIEW active_allocations_view AS
SELECT 
  aa.id,
  a.asset_name,
  a.asset_type,
  a.serial_number,
  u.name as employee_name,
  u.email,
  ep.designation,
  d.department_name,
  aa.allocated_date,
  aa.condition_on_allocation,
  aa.notes
FROM asset_allocations aa
JOIN assets a ON aa.asset_id = a.id
JOIN employee_profiles ep ON aa.employee_id = ep.id
JOIN users u ON ep.user_id = u.id
LEFT JOIN departments d ON ep.department_id = d.id
WHERE aa.is_active = TRUE AND aa.returned_date IS NULL;

-- Employee asset report view
CREATE OR REPLACE VIEW employee_asset_report_view AS
SELECT 
  u.id,
  u.name,
  u.email,
  d.department_name,
  COUNT(CASE WHEN aa.is_active = TRUE THEN 1 END) as active_assets,
  COUNT(CASE WHEN aa.returned_date IS NOT NULL THEN 1 END) as returned_assets,
  STRING_AGG(DISTINCT a.asset_type, ', ' ORDER BY a.asset_type) as asset_types
FROM employee_profiles ep
JOIN users u ON ep.user_id = u.id
LEFT JOIN departments d ON ep.department_id = d.id
LEFT JOIN asset_allocations aa ON ep.id = aa.employee_id
LEFT JOIN assets a ON aa.asset_id = a.id
GROUP BY u.id, u.name, u.email, d.department_name;

-- Department statistics view
CREATE OR REPLACE VIEW department_statistics_view AS
SELECT 
  d.id,
  d.department_name,
  COUNT(DISTINCT ep.id) as employee_count,
  COUNT(DISTINCT aa.id) as total_allocations,
  COUNT(DISTINCT CASE WHEN aa.is_active = TRUE THEN aa.id END) as active_allocations,
  COUNT(DISTINCT a.id) as unique_assets
FROM departments d
LEFT JOIN employee_profiles ep ON d.id = ep.department_id
LEFT JOIN asset_allocations aa ON ep.id = aa.employee_id
LEFT JOIN assets a ON aa.asset_id = a.id
GROUP BY d.id, d.department_name;

-- Leave summary view
CREATE OR REPLACE VIEW leave_summary_view AS
SELECT 
  u.id,
  u.name,
  u.email,
  COUNT(DISTINCT la.id) as total_leaves,
  COUNT(DISTINCT CASE WHEN la.status = 'Approved' THEN la.id END) as approved_leaves,
  COUNT(DISTINCT CASE WHEN la.status = 'Pending' THEN la.id END) as pending_leaves,
  COUNT(DISTINCT CASE WHEN la.status = 'Rejected' THEN la.id END) as rejected_leaves
FROM users u
LEFT JOIN employee_profiles ep ON u.id = ep.user_id
LEFT JOIN leave_applications la ON ep.id = la.employee_id
GROUP BY u.id, u.name, u.email;

-- ============================================
-- 5. INDEXES FOR PERFORMANCE
-- ============================================

CREATE INDEX IF NOT EXISTS idx_asset_allocations_employee_id ON asset_allocations(employee_id);
CREATE INDEX IF NOT EXISTS idx_asset_allocations_asset_id ON asset_allocations(asset_id);
CREATE INDEX IF NOT EXISTS idx_asset_allocations_is_active ON asset_allocations(is_active);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_entity_type ON audit_logs(entity_type);
CREATE INDEX IF NOT EXISTS idx_audit_logs_performed_at ON audit_logs(performed_at);
CREATE INDEX IF NOT EXISTS idx_assets_status ON assets(status);

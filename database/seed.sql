INSERT INTO users (name, email) VALUES
  ('Admin User', 'admin@vistra.local');

INSERT INTO folders (name, parent_id, created_by) VALUES
  ('Finance', NULL, 1),
  ('Legal', NULL, 1),
  ('Q1 Reports', 1, 1);

INSERT INTO documents (name, file_type, file_size, folder_id, created_by) VALUES
  ('Root Notes', 'txt', 1200, NULL, 1),
  ('Tax Filing 2025', 'pdf', 285400, 1, 1),
  ('Board Minutes', 'docx', 98500, 2, 1),
  ('Revenue Overview', 'xlsx', 66400, 3, 1);

// import pool from '../config/database.js';
// import Filter from '../models/Filter.js';
// import FilterValue from '../models/FilterValue.js';

// async function buildFilters(includeDisabled = false) {
//   const connection = await pool.getConnection();
//   try {
//     const sql = `SELECT f.id as filter_id, f.name as filter_name, f.` + "`key`" + ` as filter_key, f.enabled as filter_enabled,
//       fv.id as value_id, fv.value as value, fv.slug as value_slug, fv.enabled as value_enabled, fv.sort_order as value_order
//       FROM filters f
//       LEFT JOIN filter_values fv ON fv.filter_id = f.id
//       ${includeDisabled ? '' : 'WHERE f.enabled = 1'}
//       ORDER BY f.id, fv.sort_order, fv.id`;
//     const [rows] = await connection.query(sql);
//     const byFilter = {};
//     for (const r of rows) {
//       const fid = r.filter_id;
//       if (!byFilter[fid]) {
//         byFilter[fid] = {
//           id: fid,
//           name: r.filter_name,
//           key: r.filter_key,
//           enabled: !!r.filter_enabled,
//           values: []
//         };
//       }
//       if (r.value_id) {
//         byFilter[fid].values.push({
//           id: r.value_id,
//           value: r.value,
//           slug: r.value_slug,
//           enabled: !!r.value_enabled,
//           sort_order: r.value_order
//         });
//       }
//     }
//     return Object.values(byFilter);
//   } finally {
//     connection.release();
//   }
// }

// const getFilters = async (req, res) => {
//   try {
//     const includeDisabled = req.query.all === '1' || false;
//     const data = await buildFilters(includeDisabled);
//     res.json({ filters: data });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// const createFilter = async (req, res) => {
//   try {
//     const { name, key, enabled } = req.body;
//     if (!name || !key) return res.status(400).json({ error: 'Missing name or key' });
//     const id = await Filter.create({ name, key, enabled: enabled ? 1 : 0 });
//     const filter = await Filter.getById(id);
//     res.status(201).json(filter);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// const updateFilter = async (req, res) => {
//   try {
//     const id = req.params.id;
//     const { name, key, enabled } = req.body;
//     const updated = await Filter.update(id, { name, key, enabled });
//     res.json(updated);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// const deleteFilter = async (req, res) => {
//   try {
//     const id = req.params.id;
//     const ok = await Filter.delete(id);
//     res.json({ success: !!ok });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// // Values
// const createValue = async (req, res) => {
//   try {
//     const filter_id = req.params.id;
//     const { value, slug, enabled, sort_order } = req.body;
//     if (!value) return res.status(400).json({ error: 'Missing value' });
//     const id = await FilterValue.create({ filter_id, value, slug, enabled: enabled ? 1 : 0, sort_order: sort_order || 0 });
//     const values = await FilterValue.getByFilterId(filter_id, true);
//     res.status(201).json({ id, values });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// const updateValue = async (req, res) => {
//   try {
//     const { filterId, id } = req.params;
//     const { value, slug, enabled, sort_order } = req.body;
//     const updated = await FilterValue.update(id, { value, slug, enabled, sort_order });
//     res.json(updated);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// const deleteValue = async (req, res) => {
//   try {
//     const { filterId, id } = req.params;
//     const ok = await FilterValue.delete(id);
//     res.json({ success: !!ok });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// export default {
//   getFilters,
//   createFilter,
//   updateFilter,
//   deleteFilter,
//   createValue,
//   updateValue,
//   deleteValue
// };


import pool from '../config/database.js';
import Filter from '../models/Filter.js';
import FilterValue from '../models/FilterValue.js';

// Build filters helper
async function buildFilters(includeDisabled = false) {
  const connection = await pool.getConnection();
  try {
    const sql = `
      SELECT f.id as filter_id, f.name as filter_name, f.filter_key as filter_key, f.enabled as filter_enabled,
             fv.id as value_id, fv.value as value, fv.slug as value_slug, fv.enabled as value_enabled, fv.sort_order as value_order
      FROM filters f
      LEFT JOIN filter_values fv ON fv.filter_id = f.id
      ${includeDisabled ? '' : 'WHERE f.enabled = 1'}
      ORDER BY f.id, fv.sort_order, fv.id
    `;
    const [rows] = await connection.query(sql);
    const byFilter = {};

    for (const r of rows) {
      const fid = r.filter_id;
      if (!byFilter[fid]) {
        byFilter[fid] = {
          id: fid,
          name: r.filter_name,
          key: r.filter_key,
          enabled: !!r.filter_enabled,
          values: []
        };
      }
      if (r.value_id) {
        byFilter[fid].values.push({
          id: r.value_id,
          value: r.value,
          slug: r.value_slug,
          enabled: !!r.value_enabled,
          sort_order: r.value_order
        });
      }
    }
    return Object.values(byFilter);
  } finally {
    connection.release();
  }
}

// Controllers
const getFilters = async (req, res) => {
  try {
    const includeDisabled = req.query.all === '1';
    const data = await buildFilters(includeDisabled);
    res.json({ filters: data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createFilter = async (req, res) => {
  try {
    const { name, key, enabled } = req.body;
    if (!name || !key) return res.status(400).json({ error: 'Missing name or key' });

    const id = await Filter.create({ name, filter_key: key, enabled: enabled ? 1 : 0 });
    const filter = await Filter.getById(id);
    res.status(201).json(filter);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateFilter = async (req, res) => {
  try {
    const id = req.params.id;
    const { name, key, enabled } = req.body;
    const updated = await Filter.update(id, { name, filter_key: key, enabled });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteFilter = async (req, res) => {
  try {
    const id = req.params.id;
    const ok = await Filter.delete(id);
    res.json({ success: !!ok });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Filter values
const createValue = async (req, res) => {
  try {
    const filter_id = req.params.id;
    const { value, slug, enabled, sort_order } = req.body;
    if (!value) return res.status(400).json({ error: 'Missing value' });

    const id = await FilterValue.create({
      filter_id,
      value,
      slug: slug || null,
      enabled: enabled ? 1 : 0,
      sort_order: sort_order || 0
    });
    const values = await FilterValue.getByFilterId(filter_id, true);
    res.status(201).json({ id, values });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateValue = async (req, res) => {
  try {
    const { filterId, id } = req.params;
    const { value, slug, enabled, sort_order } = req.body;
    const updated = await FilterValue.update(id, { value, slug, enabled, sort_order });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteValue = async (req, res) => {
  try {
    const { filterId, id } = req.params;
    const ok = await FilterValue.delete(id);
    res.json({ success: !!ok });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export default {
  getFilters,
  createFilter,
  updateFilter,
  deleteFilter,
  createValue,
  updateValue,
  deleteValue
};
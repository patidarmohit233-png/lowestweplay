/**
 * Maintenance mode switch.
 *
 * true  -> public homepage shows the maintenance notice
 * false -> normal homepage (src/pages/Index.tsx) is restored
 *
 * Admin routes (/admin, /admin-lowest-shubham, /admin-lowest) and the
 * database are never affected by this flag.
 */
export const MAINTENANCE_MODE = true;

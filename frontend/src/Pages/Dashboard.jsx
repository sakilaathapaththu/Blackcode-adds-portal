// src/Pages/Dashboard.jsx
import React, { useEffect, useMemo, useState, useContext } from "react";
import http from "../Utils/http";
import { AuthContext } from "../Context/AuthContext";

const styles = {
  layout: { display: "grid", gridTemplateColumns: "260px 1fr", minHeight: "100vh" },
  sidebar: {
    background: "#0f172a", color: "white", padding: "16px 12px", display: "flex",
    flexDirection: "column", gap: 8,
  },
  brand: { fontWeight: 700, fontSize: 18, marginBottom: 12 },
  navBtn: (active) => ({
    textAlign: "left", background: active ? "#1e293b" : "transparent", border: "none",
    color: "white", padding: "10px 12px", borderRadius: 8, cursor: "pointer",
  }),
  main: { display: "flex", flexDirection: "column", minWidth: 0 },
  topbar: {
    height: 56, borderBottom: "1px solid #e5e7eb", display: "flex",
    alignItems: "center", justifyContent: "space-between", padding: "0 16px",
  },
  title: { fontWeight: 600, fontSize: 18 },
  logout: {
    border: "1px solid #e5e7eb", background: "white", borderRadius: 8, padding: "6px 10px",
    cursor: "pointer",
  },
  content: { padding: 16 },
  card: { background: "white", border: "1px solid #e5e7eb", borderRadius: 10, padding: 12 },
  actionsRow: { display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" },
  tableWrap: { overflow: "auto" },
  table: { width: "100%", borderCollapse: "collapse" },
  th: { textAlign: "left", borderBottom: "1px solid #e5e7eb", padding: "10px 8px", whiteSpace: "nowrap" },
  td: { borderBottom: "1px solid #f3f4f6", padding: "10px 8px", verticalAlign: "top" },
  pill: (kind) => ({
    display: "inline-block",
    padding: "2px 8px",
    borderRadius: 999,
    fontSize: 12,
    background:
      kind === "approved" ? "#dcfce7" :
      kind === "pending" ? "#fef9c3" :
      kind === "canceled" ? "#fee2e2" : "#e5e7eb",
    color:
      kind === "approved" ? "#166534" :
      kind === "pending" ? "#854d0e" :
      kind === "canceled" ? "#991b1b" : "#111827",
  }),
  smallBtn: (variant = "ghost") => ({
    border: "1px solid " + (variant === "solid" ? "#10b981" : "#e5e7eb"),
    background: variant === "solid" ? "#10b981" : "white",
    color: variant === "solid" ? "white" : "#111827",
    padding: "6px 10px",
    borderRadius: 8,
    cursor: "pointer",
  }),
};

const TABS = {
  pending: "Pending Posts",
  approved: "Approved Posts",
  providers: "Providers",
};

export default function Dashboard() {
  const { user, logout } = useContext(AuthContext);
  const [tab, setTab] = useState("pending");

  // ---------- Posts state ----------
  const [allPosts, setAllPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(false);

  // ---------- Users state (for provider promotion) ----------
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  // initial fetch
  useEffect(() => {
    if (!user) return;
    if (tab === "pending" || tab === "approved") fetchPosts();
    if (tab === "providers") fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab, user]);

  // API: fetch all (admin can request include=all)
  async function fetchPosts() {
    try {
      setLoadingPosts(true);
      const res = await http.get("/posts?include=all");
      setAllPosts(res.data || []);
    } catch (e) {
      console.error(e);
      alert("Failed to load posts: " + e.message);
    } finally {
      setLoadingPosts(false);
    }
  }

  // API: set post status / sponsored
  async function setPostStatus(id, payload) {
    try {
      await http.patch(`/posts/${id}/status`, payload);
      await fetchPosts();
    } catch (e) {
      console.error(e);
      alert("Failed: " + e.message);
    }
  }

  // API (example): get users (you can filter on backend if you like)
  async function fetchUsers() {
    try {
      setLoadingUsers(true);
      // You can implement this endpoint server-side to return {users: [...]}
      // e.g., GET /api/admin/users
      const res = await http.get("/admin/users");
      setUsers(res.data?.users || []);
    } catch (e) {
      console.error(e);
      // Not fatal if you haven't built this yet
    } finally {
      setLoadingUsers(false);
    }
  }

  // API (example): promote to provider
  async function promoteUser(userId) {
    if (!window.confirm("Promote this user to provider?")) return;
    try {
      await http.patch(`/admin/users/${userId}/role`, { role: "provider" });
      await fetchUsers();
      alert("User promoted to provider");
    } catch (e) {
      console.error(e);
      alert("Failed to promote: " + e.message);
    }
  }

  const pendingPosts = useMemo(
    () => allPosts.filter((p) => p.status === "pending"),
    [allPosts]
  );
  const approvedPosts = useMemo(
    () => allPosts.filter((p) => p.status === "approved"),
    [allPosts]
  );

  const Title = TABS[tab];

  return (
    <div style={styles.layout}>
      {/* Sidebar */}
      <aside style={styles.sidebar}>
        <div style={styles.brand}>Admin Console</div>
        <button style={styles.navBtn(tab === "pending")} onClick={() => setTab("pending")}>
          Pending Posts
        </button>
        <button style={styles.navBtn(tab === "approved")} onClick={() => setTab("approved")}>
          Approved Posts
        </button>
        <button style={styles.navBtn(tab === "providers")} onClick={() => setTab("providers")}>
          Providers
        </button>
      </aside>

      {/* Main */}
      <main style={styles.main}>
        {/* Top bar */}
        <div style={styles.topbar}>
          <div style={styles.title}>{Title}</div>
          <div>
            <span style={{ marginRight: 12, color: "#6b7280" }}>
              {user?.name || user?.username} ({user?.role})
            </span>
            <button style={styles.logout} onClick={logout}>Logout</button>
          </div>
        </div>

        {/* Content */}
        <div style={styles.content}>
          {tab === "pending" && (
            <section style={styles.card}>
              <div style={styles.actionsRow}>
                <button style={styles.smallBtn()} onClick={fetchPosts} disabled={loadingPosts}>
                  {loadingPosts ? "Refreshing..." : "Refresh"}
                </button>
              </div>
              <PostsTable
                rows={pendingPosts}
                loading={loadingPosts}
                onApprove={(row) => setPostStatus(row._id, { status: "approved" })}
                onCancel={(row) => setPostStatus(row._id, { status: "canceled" })}
                onSponsor={(row, val) => setPostStatus(row._id, { sponsored: val ? 1 : 0 })}
                allowActions
              />
            </section>
          )}

          {tab === "approved" && (
            <section style={styles.card}>
              <div style={styles.actionsRow}>
                <button style={styles.smallBtn()} onClick={fetchPosts} disabled={loadingPosts}>
                  {loadingPosts ? "Refreshing..." : "Refresh"}
                </button>
              </div>
              <PostsTable
                rows={approvedPosts}
                loading={loadingPosts}
                onCancel={(row) => setPostStatus(row._id, { status: "canceled" })}
                onSponsor={(row, val) => setPostStatus(row._id, { sponsored: val ? 1 : 0 })}
                allowActions
              />
            </section>
          )}

          {tab === "providers" && (
            <section style={styles.card}>
              <div style={styles.actionsRow}>
                <button style={styles.smallBtn()} onClick={fetchUsers} disabled={loadingUsers}>
                  {loadingUsers ? "Refreshing..." : "Refresh"}
                </button>
              </div>
              <ProvidersTable
                rows={users}
                loading={loadingUsers}
                onPromote={(u) => promoteUser(u._id)}
              />
              <div style={{ marginTop: 10, fontSize: 12, color: "#6b7280" }}>
                Note: This uses <code>GET /api/admin/users</code> and <code>PATCH /api/admin/users/:id/role</code>.
                Wire these routes on the backend if you haven’t yet.
              </div>
            </section>
          )}
        </div>
      </main>
    </div>
  );
}

// ---------- Posts Table ----------
function PostsTable({ rows, loading, onApprove, onCancel, onSponsor, allowActions }) {
  return (
    <div style={styles.tableWrap}>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Title</th>
            <th style={styles.th}>Owner</th>
            <th style={styles.th}>Category</th>
            <th style={styles.th}>Price</th>
            <th style={styles.th}>Status</th>
            <th style={styles.th}>Sponsored</th>
            <th style={styles.th}>Window</th>
            {allowActions && <th style={styles.th}>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr><td colSpan={8} style={styles.td}>Loading…</td></tr>
          ) : rows.length === 0 ? (
            <tr><td colSpan={8} style={styles.td}>No data</td></tr>
          ) : (
            rows.map((r) => (
              <tr key={r._id}>
                <td style={styles.td}>
                  <div style={{ fontWeight: 600 }}>{r.title}</div>
                  <div style={{ fontSize: 12, color: "#6b7280" }}>{r.description?.slice(0, 120) || "-"}</div>
                </td>
                <td style={styles.td}>{r.owner?.username || r.owner?.name || "-"}</td>
                <td style={styles.td}>{r.category}</td>
                <td style={styles.td}>{Number(r.price).toLocaleString()}</td>
                <td style={styles.td}><span style={styles.pill(r.status)}>{r.status}</span></td>
                <td style={styles.td}>
                  <label style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                    <input
                      type="checkbox"
                      checked={!!r.sponsored}
                      onChange={(e) => onSponsor?.(r, e.target.checked)}
                    />
                    <span>Sponsored</span>
                  </label>
                </td>
                <td style={styles.td}>
                  <div style={{ fontSize: 12 }}>
                    <div>Start: {r.startDate ? fmtDate(r.startDate) : "—"}</div>
                    <div>End: {r.endDate ? fmtDate(r.endDate) : "—"}</div>
                  </div>
                </td>
                {allowActions && (
                  <td style={styles.td}>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      {onApprove && r.status !== "approved" && (
                        <button style={styles.smallBtn("solid")} onClick={() => onApprove(r)}>
                          Approve
                        </button>
                      )}
                      {onCancel && r.status !== "canceled" && (
                        <button
                          style={{ ...styles.smallBtn(), borderColor: "#ef4444", color: "#b91c1c" }}
                          onClick={() => onCancel(r)}
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

// ---------- Providers Table ----------
function ProvidersTable({ rows, loading, onPromote }) {
  return (
    <div style={styles.tableWrap}>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Name</th>
            <th style={styles.th}>Username</th>
            <th style={styles.th}>Email</th>
            <th style={styles.th}>Phone</th>
            <th style={styles.th}>Role</th>
            <th style={styles.th}>Action</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr><td colSpan={6} style={styles.td}>Loading…</td></tr>
          ) : rows.length === 0 ? (
            <tr><td colSpan={6} style={styles.td}>No users</td></tr>
          ) : (
            rows.map((u) => (
              <tr key={u._id}>
                <td style={styles.td}>{u.name || "-"}</td>
                <td style={styles.td}>{u.username || "-"}</td>
                <td style={styles.td}>{u.email || "-"}</td>
                <td style={styles.td}>{u.phone || "-"}</td>
                <td style={styles.td}><span style={styles.pill(u.role)}>{u.role}</span></td>
                <td style={styles.td}>
                  {u.role !== "provider" ? (
                    <button style={styles.smallBtn("solid")} onClick={() => onPromote(u)}>
                      Promote to Provider
                    </button>
                  ) : (
                    <span style={{ fontSize: 12, color: "#16a34a" }}>Already provider</span>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

function fmtDate(d) {
  try {
    const date = typeof d === "string" ? new Date(d) : d;
    return date.toLocaleString();
  } catch {
    return "—";
  }
}

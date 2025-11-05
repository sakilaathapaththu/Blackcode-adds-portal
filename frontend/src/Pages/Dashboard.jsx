// src/Pages/Dashboard.jsx
import React, { useEffect, useMemo, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import http from "../Utils/http";
import { AuthContext } from "../Context/AuthContext";
import { useMediaQuery } from "@mui/material";

// build responsive styles without changing your DOM/content
const makeStyles = (isMobile) => ({
  layout: {
    display: "grid",
    gridTemplateColumns: isMobile ? "1fr" : "260px 1fr",
    minHeight: "100vh",
    gridAutoRows: "min-content",
  },

  // Sidebar becomes a sticky, horizontally scrollable strip on mobile
  sidebar: {
    background: "#0f172a",
    color: "white",
    padding: isMobile ? "10px 8px" : "16px 12px",
    display: "flex",
    flexDirection: isMobile ? "row" : "column",
    alignItems: isMobile ? "center" : "stretch",
    gap: 8,
    position: isMobile ? "sticky" : "static",
    top: isMobile ? 0 : "auto",
    zIndex: 20,
    overflowX: isMobile ? "auto" : "visible",
    whiteSpace: isMobile ? "nowrap" : "normal",
    borderBottom: isMobile ? "1px solid rgba(255,255,255,0.08)" : "none",
  },
  brand: {
    fontWeight: 700,
    fontSize: isMobile ? 16 : 18,
    marginBottom: isMobile ? 0 : 12,
    marginRight: isMobile ? 8 : 0,
    flex: "0 0 auto",
  },
  navBtn: (active) => ({
    textAlign: "left",
    background: active ? "#1e293b" : "transparent",
    border: "none",
    color: "white",
    padding: isMobile ? "8px 10px" : "10px 12px",
    borderRadius: 8,
    cursor: "pointer",
    flex: isMobile ? "0 0 auto" : "initial",
    whiteSpace: "nowrap",
  }),

  main: { display: "flex", flexDirection: "column", minWidth: 0 },
  topbar: {
    height: isMobile ? 52 : 56,
    borderBottom: "1px solid #e5e7eb",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: isMobile ? "0 10px" : "0 16px",
    position: isMobile ? "sticky" : "static",
    top: isMobile ? 0 : "auto",
    background: isMobile ? "white" : "transparent",
    zIndex: 10,
  },
  title: { fontWeight: 600, fontSize: isMobile ? 16 : 18 },
  logout: {
    border: "1px solid #e5e7eb",
    background: "white",
    borderRadius: 8,
    padding: isMobile ? "6px 8px" : "6px 10px",
    cursor: "pointer",
    fontSize: isMobile ? 12 : 14,
  },

  content: { padding: isMobile ? 12 : 16 },
  card: {
    background: "white",
    border: "1px solid #e5e7eb",
    borderRadius: 10,
    padding: isMobile ? 10 : 12,
  },
  actionsRow: {
    display: "flex",
    gap: 8,
    marginBottom: 12,
    flexWrap: "wrap",
  },

  tableWrap: { overflow: "auto" }, // horizontal scroll on small screens
  table: { width: "100%", borderCollapse: "collapse", minWidth: 720 },
  th: {
    textAlign: "left",
    borderBottom: "1px solid #e5e7eb",
    padding: isMobile ? "8px 6px" : "10px 8px",
    whiteSpace: "nowrap",
    fontSize: isMobile ? 12 : 14,
  },
  td: {
    borderBottom: "1px solid #f3f4f6",
    padding: isMobile ? "8px 6px" : "10px 8px",
    verticalAlign: "top",
    fontSize: isMobile ? 12 : 14,
  },
  pill: (kind) => ({
    display: "inline-block",
    padding: isMobile ? "1px 6px" : "2px 8px",
    borderRadius: 999,
    fontSize: isMobile ? 11 : 12,
    background:
      kind === "approved"
        ? "#dcfce7"
        : kind === "pending"
        ? "#fef9c3"
        : kind === "canceled"
        ? "#fee2e2"
        : "#e5e7eb",
    color:
      kind === "approved"
        ? "#166534"
        : kind === "pending"
        ? "#854d0e"
        : kind === "canceled"
        ? "#991b1b"
        : "#111827",
  }),
  smallBtn: (variant = "ghost") => ({
    border: "1px solid " + (variant === "solid" ? "#10b981" : "#e5e7eb"),
    background: variant === "solid" ? "#10b981" : "white",
    color: variant === "solid" ? "white" : "#111827",
    padding: isMobile ? "6px 8px" : "6px 10px",
    borderRadius: 8,
    cursor: "pointer",
    fontSize: isMobile ? 12 : 14,
  }),
  dangerBtn: {
    border: "1px solid #ef4444",
    background: "white",
    color: "#b91c1c",
    padding: isMobile ? "6px 8px" : "6px 10px",
    borderRadius: 8,
    cursor: "pointer",
    fontSize: isMobile ? 12 : 14,
  },

  grid: {
    display: "grid",
    gridTemplateColumns: isMobile
      ? "repeat(auto-fill, minmax(220px, 1fr))"
      : "repeat(auto-fill, minmax(280px, 1fr))",
    gap: isMobile ? 10 : 12,
  },
  postCard: {
    border: "1px solid #e5e7eb",
    borderRadius: 10,
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    background: "white",
  },
  imgBox: {
    width: "100%",
    height: isMobile ? 130 : 160,
    background: "#f3f4f6",
  },
  img: { width: "100%", height: "100%", objectFit: "cover" },
  postBody: {
    padding: isMobile ? 10 : 12,
    display: "flex",
    flexDirection: "column",
    gap: isMobile ? 6 : 6,
    flex: 1,
  },
  postTitle: { fontWeight: 700, fontSize: isMobile ? 13 : 14, lineHeight: "18px" },
  postMeta: { fontSize: isMobile ? 11 : 12, color: "#6b7280" },
  rowBetween: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 },
  actionsInline: { display: "flex", gap: 8, flexWrap: "wrap", marginTop: 6 },
  badge: {
    fontSize: isMobile ? 11 : 12,
    padding: isMobile ? "1px 5px" : "2px 6px",
    borderRadius: 999,
    background: "#eef2ff",
    color: "#3730a3",
  },

  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.35)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 50,
    padding: isMobile ? "0 8px" : 0,
  },
  modal: {
    width: isMobile ? "min(96vw, 640px)" : "min(720px, 92vw)",
    background: "white",
    borderRadius: 10,
    border: "1px solid #e5e7eb",
  },
  modalHead: {
    padding: isMobile ? "10px 12px" : "12px 14px",
    borderBottom: "1px solid #e5e7eb",
    fontWeight: 700,
    fontSize: isMobile ? 14 : 16,
  },
  modalBody: {
    padding: isMobile ? 12 : 14,
    display: "grid",
    gap: 10,
    gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
  },
  input: {
    width: "100%",
    padding: isMobile ? "8px 10px" : "8px 10px",
    border: "1px solid #e5e7eb",
    borderRadius: 8,
    fontSize: isMobile ? 14 : 14,
  },
  modalFoot: {
    padding: isMobile ? 10 : 12,
    borderTop: "1px solid #e5e7eb",
    display: "flex",
    gap: 8,
    justifyContent: "flex-end",
  },
});

/** image URL helper (unchanged) */
const fileURL = (rel) => {
  if (!rel) return null;
  if (/^https?:\/\//i.test(rel)) return rel;
  let p = rel.startsWith("/") ? rel : `/${rel}`;
  if (p.startsWith("/api/")) return p;
  const base = (http.defaults?.baseURL || "/api").replace(/\/+$/, "");
  return `${base}${p}`;
};

const toLocalInput = (dateStr) => {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d)) return "";
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}`;
};
const fromLocalInput = (v) => v || "";

const TABS = {
  pending: "Pending Posts",
  approved: "Approved Posts",
  posts: "All Posts",
  providers: "Providers",
};

export default function Dashboard() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width:900px)");
  const styles = useMemo(() => makeStyles(isMobile), [isMobile]);

  const [tab, setTab] = useState("pending");
  const [allPosts, setAllPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    if (!user) return;
    if (tab === "pending" || tab === "approved" || tab === "posts") fetchPosts();
    if (tab === "providers") fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab, user]);

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

  async function setPostStatus(id, payload) {
    try {
      await http.patch(`/posts/${id}/status`, payload);
      await fetchPosts();
    } catch (e) {
      console.error(e);
      alert("Failed: " + e.message);
    }
  }

  async function fetchUsers() {
    try {
      setLoadingUsers(true);
      const res = await http.get("/admin/users");
      setUsers(res.data?.users || []);
    } catch (e) {
      console.error(e);
      alert("Failed to load users: " + e.message);
    } finally {
      setLoadingUsers(false);
    }
  }

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

  async function deleteUser(userId) {
    if (!window.confirm("Delete this user account? This cannot be undone.")) return;
    try {
      await http.delete(`/admin/users/${userId}`);
      await fetchUsers();
      alert("User deleted");
    } catch (e) {
      console.error(e);
      alert("Failed to delete user: " + e.message);
    }
  }

  const onOpenEdit = (post) => {
    setEditing({
      ...post,
      startDateLocal: toLocalInput(post.startDate),
      endDateLocal: toLocalInput(post.endDate),
      sortCountStr: String(post.sortCount ?? 0),
      sponsoredBool: !!post.sponsored,
      statusStr: post.status || "pending",
    });
    setEditOpen(true);
  };
  const onDeletePost = async (post) => {
    if (!window.confirm(`Delete post "${post.title}"? This cannot be undone.`)) return;
    try {
      await http.delete(`/posts/${post._id}`);
      await fetchPosts();
      alert("Post deleted");
    } catch (e) {
      console.error(e);
      alert("Failed to delete post: " + e.message);
    }
  };
  const onSaveEdit = async (payload) => {
    try {
      await http.put(`/posts/${payload._id}`, {
        status: payload.statusStr,
        sponsored: payload.sponsoredBool ? 1 : 0,
        sortCount: Number(payload.sortCountStr) || 0,
        startDate: fromLocalInput(payload.startDateLocal),
        endDate: fromLocalInput(payload.endDateLocal),
      });
      setEditOpen(false);
      setEditing(null);
      await fetchPosts();
      alert("Post updated");
    } catch (e) {
      console.error(e);
      alert("Failed to update: " + e.message);
    }
  };

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
        <button style={styles.navBtn(tab === "posts")} onClick={() => setTab("posts")}>
          Posts
        </button>
        <button style={styles.navBtn(tab === "providers")} onClick={() => setTab("providers")}>
          Providers
        </button>
      </aside>

      {/* Main */}
      <main style={styles.main}>
        <div style={styles.topbar}>
          <div style={styles.title}>{Title}</div>
          <div style={{ display: "flex", alignItems: "center" }}>
            <span style={{ marginRight: 12, color: "#6b7280", fontSize: 13 }}>
              {user?.name || user?.username} ({user?.role})
            </span>
            <button style={styles.logout} onClick={logout}>
              Logout
            </button>
          </div>
        </div>

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

          {tab === "posts" && (
            <section style={styles.card}>
              <div style={styles.actionsRow}>
                <button style={styles.smallBtn()} onClick={fetchPosts} disabled={loadingPosts}>
                  {loadingPosts ? "Refreshing..." : "Refresh"}
                </button>
              </div>
              <AllPostsCardGrid
                rows={allPosts}
                loading={loadingPosts}
                onEdit={onOpenEdit}
                onDelete={onDeletePost}
              />
              <div style={{ marginTop: 10, fontSize: 12, color: "#6b7280" }}>
                Uses <code>GET /api/posts?include=all</code>, <code>PUT /api/posts/:id</code>,{" "}
                <code>DELETE /api/posts/:id</code>.
              </div>
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
                onDelete={(u) => deleteUser(u._id)}
                currentUserId={user?._id}
              />
              <div style={{ marginTop: 10, fontSize: 12, color: "#6b7280" }}>
                Uses <code>GET /api/admin/users</code>, <code>PATCH /api/admin/users/:id/role</code>, and{" "}
                <code>DELETE /api/admin/users/:id</code>.
              </div>
            </section>
          )}
        </div>
      </main>

      {editOpen && editing && (
        <EditPostAdminModal
          post={editing}
          onClose={() => {
            setEditOpen(false);
            setEditing(null);
          }}
          onSave={onSaveEdit}
          styles={styles}
        />
      )}
    </div>
  );
}

function PostsTable({ rows, loading, onApprove, onCancel, onSponsor, allowActions }) {
  const isMobile = useMediaQuery("(max-width:900px)");
  const styles = useMemo(() => makeStyles(isMobile), [isMobile]);
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
            <tr>
              <td colSpan={8} style={styles.td}>
                Loading…
              </td>
            </tr>
          ) : rows.length === 0 ? (
            <tr>
              <td colSpan={8} style={styles.td}>
                No data
              </td>
            </tr>
          ) : (
            rows.map((r) => (
              <tr key={r._id}>
                <td style={styles.td}>
                  <div style={{ fontWeight: 600 }}>{r.title}</div>
                  <div style={{ fontSize: 12, color: "#6b7280" }}>
                    {r.description?.slice(0, 120) || "-"}
                  </div>
                </td>
                <td style={styles.td}>{r.owner?.username || r.owner?.name || "-"}</td>
                <td style={styles.td}>{r.category}</td>
                <td style={styles.td}>{Number(r.price).toLocaleString()}</td>
                <td style={styles.td}>
                  <span style={makeStyles(isMobile).pill(r.status)}>{r.status}</span>
                </td>
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
                        <button style={makeStyles(isMobile).smallBtn("solid")} onClick={() => onApprove(r)}>
                          Approve
                        </button>
                      )}
                      {onCancel && r.status !== "canceled" && (
                        <button
                          style={{ ...makeStyles(isMobile).smallBtn(), borderColor: "#ef4444", color: "#b91c1c" }}
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

function AllPostsCardGrid({ rows, loading, onEdit, onDelete }) {
  const isMobile = useMediaQuery("(max-width:900px)");
  const styles = useMemo(() => makeStyles(isMobile), [isMobile]);

  if (loading) return <div>Loading…</div>;
  if (!rows?.length) return <div>No posts</div>;

  return (
    <div style={styles.grid}>
      {rows.map((p) => {
        const image = fileURL(p.image);
        return (
          <article key={p._id} style={styles.postCard}>
            <div style={styles.imgBox}>{image ? <img src={image} alt={p.title} style={styles.img} /> : null}</div>
            <div style={styles.postBody}>
              <div style={styles.rowBetween}>
                <div style={styles.postTitle}>{p.title}</div>
                <span style={styles.pill(p.status)}>{p.status}</span>
              </div>
              <div style={styles.postMeta}>
                {p.owner?.username || p.owner?.name || "—"} • {p.category || "—"}
              </div>
              <div style={styles.rowBetween}>
                <div className="price" style={{ fontWeight: 700 }}>
                  LKR {Number(p.price || 0).toLocaleString()}
                </div>
                <span style={styles.badge}>sort: {Number(p.sortCount || 0)}</span>
              </div>
              <div style={{ fontSize: 12, color: "#6b7280" }}>
                {p.startDate ? `Start: ${fmtDate(p.startDate)}` : "Start: —"}
                <br />
                {p.endDate ? `End: ${fmtDate(p.endDate)}` : "End: —"}
              </div>

              <div style={styles.actionsInline}>
                <button style={styles.smallBtn()} onClick={() => onEdit?.(p)}>
                  ✏️ Edit
                </button>
                <button style={styles.dangerBtn} onClick={() => onDelete?.(p)}>
                  🗑️ Delete
                </button>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}

function EditPostAdminModal({ post, onClose, onSave, styles }) {
  const [statusStr, setStatusStr] = useState(post.statusStr || "pending");
  const [sponsoredBool, setSponsoredBool] = useState(!!post.sponsoredBool);
  const [sortCountStr, setSortCountStr] = useState(post.sortCountStr ?? "0");
  const [startDateLocal, setStartDateLocal] = useState(post.startDateLocal || "");
  const [endDateLocal, setEndDateLocal] = useState(post.endDateLocal || "");

  const onSubmit = (e) => {
    e.preventDefault();
    onSave({
      _id: post._id,
      statusStr,
      sponsoredBool,
      sortCountStr,
      startDateLocal,
      endDateLocal,
    });
  };

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div style={styles.modalHead}>Edit Post — {post.title}</div>
        <form onSubmit={onSubmit}>
          <div style={styles.modalBody}>
            <div>
              <label style={{ fontSize: 12, color: "#6b7280" }}>Status</label>
              <select value={statusStr} onChange={(e) => setStatusStr(e.target.value)} style={styles.input}>
                {["pending", "approved", "canceled"].map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ fontSize: 12, color: "#6b7280" }}>Sponsored</label>
              <div>
                <label style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                  <input
                    type="checkbox"
                    checked={sponsoredBool}
                    onChange={(e) => setSponsoredBool(e.target.checked)}
                  />
                  <span>Mark as Sponsored</span>
                </label>
              </div>
            </div>

            <div>
              <label style={{ fontSize: 12, color: "#6b7280" }}>sortCount</label>
              <input
                style={styles.input}
                value={sortCountStr}
                onChange={(e) => /^\d*$/.test(e.target.value) && setSortCountStr(e.target.value)}
                placeholder="0"
                inputMode="numeric"
              />
            </div>

            <div>
              <label style={{ fontSize: 12, color: "#6b7280" }}>Start Date</label>
              <input
                type="datetime-local"
                style={styles.input}
                value={startDateLocal}
                onChange={(e) => setStartDateLocal(e.target.value)}
              />
            </div>

            <div>
              <label style={{ fontSize: 12, color: "#6b7280" }}>End Date</label>
              <input
                type="datetime-local"
                style={styles.input}
                value={endDateLocal}
                onChange={(e) => setEndDateLocal(e.target.value)}
              />
            </div>
          </div>

          <div style={styles.modalFoot}>
            <button type="button" style={styles.smallBtn()} onClick={onClose}>
              Close
            </button>
            <button type="submit" style={styles.smallBtn("solid")}>
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ProvidersTable({ rows, loading, onPromote, onDelete, currentUserId }) {
  const isMobile = useMediaQuery("(max-width:900px)");
  const styles = useMemo(() => makeStyles(isMobile), [isMobile]);
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
            <th style={styles.th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={6} style={styles.td}>
                Loading…
              </td>
            </tr>
          ) : rows.length === 0 ? (
            <tr>
              <td colSpan={6} style={styles.td}>
                No users
              </td>
            </tr>
          ) : (
            rows.map((u) => {
              const isSelf = u._id === currentUserId;
              return (
                <tr key={u._id}>
                  <td style={styles.td}>{u.name || "-"}</td>
                  <td style={styles.td}>{u.username || "-"}</td>
                  <td style={styles.td}>{u.email || "-"}</td>
                  <td style={styles.td}>{u.phone || "-"}</td>
                  <td style={styles.td}>
                    <span style={styles.pill(u.role)}>{u.role}</span>
                  </td>
                  <td style={styles.td}>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      {u.role !== "provider" && (
                        <button style={styles.smallBtn("solid")} onClick={() => onPromote(u)}>
                          Promote to Provider
                        </button>
                      )}
                      <button
                        style={styles.dangerBtn}
                        onClick={() => onDelete(u)}
                        disabled={isSelf}
                        title={isSelf ? "You cannot delete your own account" : "Delete this user"}
                      >
                        Delete User
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })
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

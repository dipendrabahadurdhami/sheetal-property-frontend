import React, { useEffect, useState } from "react";
import apiClient from "../../utils/apiClient";
import { FaBell, FaSpinner, FaCheckDouble } from "react-icons/fa";
import { toast } from "react-toastify";
import axios from "axios";

const AgentNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading]             = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    const fetchNotifications = async () => {
      setLoading(true);
      try {
        const res = await apiClient.get("agent-notifications", {
          signal: controller.signal,
        });
        setNotifications(res.data?.data || res.data || []);
      } catch (err) {
        if (axios.isCancel(err)) return;
        setNotifications([]);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
    return () => controller.abort();
  }, []);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get("agent-notifications");
      setNotifications(res.data?.data || res.data || []);
    } catch {
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  const markAllRead = async () => {
    try {
      await apiClient.post("agent-notifications/read-all");
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
      toast.success("All marked as read");
    } catch {
      toast.error("Failed to mark as read");
    }
  };

  const markRead = async (id) => {
    try {
      await apiClient.post(`agent-notifications/${id}/read`);
      setNotifications(prev =>
        prev.map(n => n.id === id ? { ...n, is_read: true } : n)
      );
    } catch {}
  };

  const unread = notifications.filter(n => !n.is_read).length;

  const typeIcon = (type) => {
    const map = {
      expiry:  "⏰",
      lead:    "📞",
      upgrade: "⬆️",
      deal:    "🤝",
      payment: "💰",
    };
    return map[type] || "🔔";
  };

  return (
    <div style={{ padding: 24, maxWidth: 700 }}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: "#111", margin: 0 }}>Notifications</h2>
          {unread > 0 && (
            <span style={{ fontSize: 12, color: "#b91c1c", fontWeight: 600 }}>
              {unread} unread
            </span>
          )}
        </div>
        {unread > 0 && (
          <button
            onClick={markAllRead}
            style={{
              display: "flex", alignItems: "center", gap: 6,
              background: "none", border: "1px solid #e4e4e0",
              borderRadius: 4, padding: "7px 14px",
              fontSize: 12, fontWeight: 700, cursor: "pointer", color: "#374151",
            }}
          >
            <FaCheckDouble style={{ fontSize: 11 }} /> Mark all read
          </button>
        )}
      </div>

      {/* Loading */}
      {loading && (
        <div style={{ textAlign: "center", padding: 40 }}>
          <FaSpinner style={{ fontSize: 24, color: "#b91c1c", animation: "spin .6s linear infinite" }} />
        </div>
      )}

      {/* Empty */}
      {!loading && notifications.length === 0 && (
        <div style={{ textAlign: "center", padding: "60px 20px", border: "1px dashed #e4e4e0", borderRadius: 4 }}>
          <FaBell style={{ fontSize: 32, color: "#ddd", marginBottom: 12, display: "block", margin: "0 auto 12px" }} />
          <p style={{ fontSize: 14, color: "#9ca3af", margin: 0 }}>No notifications yet</p>
        </div>
      )}

      {/* List */}
      {!loading && notifications.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {notifications.map(n => (
            <div
              key={n.id}
              onClick={() => !n.is_read && markRead(n.id)}
              style={{
                background: n.is_read ? "#fff" : "#fef2f2",
                border: `1px solid ${n.is_read ? "#e4e4e0" : "#fecaca"}`,
                borderRadius: 4,
                padding: 16,
                cursor: n.is_read ? "default" : "pointer",
                display: "flex",
                gap: 14,
                alignItems: "flex-start",
                transition: "background .15s",
              }}
            >
              {/* Icon */}
              <div style={{
                width: 36, height: 36, borderRadius: 4,
                background: n.is_read ? "#f3f4f6" : "#fee2e2",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 16, flexShrink: 0,
              }}>
                {typeIcon(n.type)}
              </div>

              {/* Content */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
                  <p style={{ fontSize: 13, fontWeight: 700, color: "#111", margin: 0 }}>{n.title}</p>
                  {!n.is_read && (
                    <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#b91c1c", flexShrink: 0, display: "inline-block" }} />
                  )}
                </div>
                <p style={{ fontSize: 12, color: "#6b7280", margin: "4px 0 0", lineHeight: 1.5 }}>{n.message}</p>
                <p style={{ fontSize: 11, color: "#9ca3af", margin: "6px 0 0" }}>
                  {new Date(n.created_at).toLocaleDateString("en-US", {
                    month: "short", day: "numeric", year: "numeric",
                  })}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AgentNotifications;
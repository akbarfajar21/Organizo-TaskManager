import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// ✅ DIPERBAIKI: Gunakan nama environment variable, bukan nilai langsung
const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_KEY");

const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_KEY!);

// Helper: Send Email via Resend
async function sendEmail(to: string, subject: string, html: string) {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: "Organizo <https://organizo-taskmanager.vercel.app/app>", // Ganti dengan domain Anda
      to: [to],
      subject: subject,
      html: html,
    }),
  });

  return res.json();
}

// Helper: Format Date
function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

// Helper: Format Time
function formatTime(timeStr: string) {
  return timeStr ? timeStr.slice(0, 5) : "";
}

serve(async (req) => {
  try {
    const now = new Date();
    const today = now.toISOString().slice(0, 10);
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000)
      .toISOString()
      .slice(0, 10);
    const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);

    // ========================================
    // 1. NOTIFIKASI H-1 (24 JAM SEBELUM)
    // ========================================

    // Tasks H-1
    const { data: tasksH1 } = await supabase
      .from("tasks")
      .select("*, user:user_id(email)")
      .eq("due_date", tomorrow)
      .eq("notified_h1", false)
      .eq("is_done", false);

    for (const task of tasksH1 || []) {
      const email = task.user?.email;
      if (!email) continue;

      await sendEmail(
        email,
        "⏰ Reminder: Tugas Besok - Organizo",
        `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #FBBF24 0%, #F59E0B 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0;">⏰ Reminder Tugas</h1>
          </div>
          <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px;">
            <p style="font-size: 16px; color: #374151;">Halo,</p>
            <p style="font-size: 16px; color: #374151;">Kamu punya tugas yang deadline-nya <strong>besok</strong>:</p>
            
            <div style="background: white; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #FBBF24;">
              <h2 style="color: #111827; margin: 0 0 10px 0;">${task.title}</h2>
              ${task.description ? `<p style="color: #6B7280; margin: 0 0 10px 0;">${task.description}</p>` : ""}
              <p style="color: #F59E0B; font-weight: bold; margin: 0;">
                📅 ${formatDate(task.due_date)} | ⏰ ${formatTime(task.due_time)}
              </p>
            </div>
            
            <p style="font-size: 14px; color: #6B7280;">Jangan lupa untuk menyelesaikannya ya! 💪</p>
            <a href="https://organizo-taskmanager.vercel.app/app/tasks" style="display: inline-block; background: #FBBF24; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; margin-top: 20px;">
              Lihat Tugas
            </a>
          </div>
        </div>
        `
      );

      await supabase
        .from("tasks")
        .update({ notified_h1: true })
        .eq("id", task.id);
    }

    // Activities H-1
    const { data: activitiesH1 } = await supabase
      .from("activities")
      .select("*, user:user_id(email)")
      .eq("activity_date", tomorrow)
      .eq("notified_h1", false)
      .eq("is_completed", false);

    for (const activity of activitiesH1 || []) {
      const email = activity.user?.email;
      if (!email) continue;

      await sendEmail(
        email,
        "📅 Reminder: Kegiatan Besok - Organizo",
        `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #3B82F6 0%, #2563EB 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0;">📅 Reminder Kegiatan</h1>
          </div>
          <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px;">
            <p style="font-size: 16px; color: #374151;">Halo,</p>
            <p style="font-size: 16px; color: #374151;">Kamu punya kegiatan <strong>besok</strong>:</p>
            
            <div style="background: white; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #3B82F6;">
              <h2 style="color: #111827; margin: 0 0 10px 0;">${activity.title}</h2>
              ${activity.description ? `<p style="color: #6B7280; margin: 0 0 10px 0;">${activity.description}</p>` : ""}
              <p style="color: #3B82F6; font-weight: bold; margin: 0;">
                📅 ${formatDate(activity.activity_date)} | ⏰ ${formatTime(activity.start_time)}
                ${activity.location ? ` | 📍 ${activity.location}` : ""}
              </p>
            </div>
            
            <p style="font-size: 14px; color: #6B7280;">Jangan sampai terlewat ya! 🎯</p>
            <a href="https://organizo-taskmanager.vercel.app/app/activities" style="display: inline-block; background: #3B82F6; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; margin-top: 20px;">
              Lihat Kegiatan
            </a>
          </div>
        </div>
        `
      );

      await supabase
        .from("activities")
        .update({ notified_h1: true })
        .eq("id", activity.id);
    }

    // ========================================
    // 2. NOTIFIKASI HARI H (PAGI HARI)
    // ========================================

    // Hanya kirim jika jam 06:00 - 07:00
    if (now.getHours() === 6) {
      // Get all users with tasks/activities today
      const { data: usersWithTasks } = await supabase
        .from("tasks")
        .select("user_id")
        .eq("due_date", today)
        .eq("is_done", false);

      const { data: usersWithActivities } = await supabase
        .from("activities")
        .select("user_id")
        .eq("activity_date", today)
        .eq("is_completed", false);

      const uniqueUserIds = [
        ...new Set([
          ...(usersWithTasks?.map((t) => t.user_id) || []),
          ...(usersWithActivities?.map((a) => a.user_id) || []),
        ]),
      ];

      for (const userId of uniqueUserIds) {
        const { data: user } = await supabase.auth.admin.getUserById(userId);
        if (!user?.user?.email) continue;

        const { data: todayTasks } = await supabase
          .from("tasks")
          .select("*")
          .eq("user_id", userId)
          .eq("due_date", today)
          .eq("is_done", false);

        const { data: todayActivities } = await supabase
          .from("activities")
          .select("*")
          .eq("user_id", userId)
          .eq("activity_date", today)
          .eq("is_completed", false);

        const tasksHtml = (todayTasks || [])
          .map(
            (t) => `
          <div style="background: white; padding: 15px; border-radius: 8px; margin: 10px 0; border-left: 4px solid #FBBF24;">
            <h3 style="color: #111827; margin: 0 0 5px 0;">${t.title}</h3>
            <p style="color: #F59E0B; font-size: 14px; margin: 0;">⏰ ${formatTime(t.due_time)}</p>
          </div>
        `
          )
          .join("");

        const activitiesHtml = (todayActivities || [])
          .map(
            (a) => `
          <div style="background: white; padding: 15px; border-radius: 8px; margin: 10px 0; border-left: 4px solid #3B82F6;">
            <h3 style="color: #111827; margin: 0 0 5px 0;">${a.title}</h3>
            <p style="color: #3B82F6; font-size: 14px; margin: 0;">
              ⏰ ${formatTime(a.start_time)}
              ${a.location ? ` | 📍 ${a.location}` : ""}
            </p>
          </div>
        `
          )
          .join("");

        await sendEmail(
          user.user.email,
          "🌅 Agenda Hari Ini - Organizo",
          `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #10B981 0%, #059669 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
              <h1 style="color: white; margin: 0;">🌅 Selamat Pagi!</h1>
            </div>
            <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px;">
              <p style="font-size: 16px; color: #374151;">Ini agenda kamu hari ini:</p>
              
              ${todayTasks && todayTasks.length > 0 ? `<h2 style="color: #111827; font-size: 18px;">📋 Tugas (${todayTasks.length})</h2>${tasksHtml}` : ""}
              
              ${todayActivities && todayActivities.length > 0 ? `<h2 style="color: #111827; font-size: 18px; margin-top: 20px;">📅 Kegiatan (${todayActivities.length})</h2>${activitiesHtml}` : ""}
              
              <p style="font-size: 14px; color: #6B7280; margin-top: 20px;">Semangat menjalani hari ini! 💪</p>
              <a href="https://organizo-taskmanager.vercel.app/app/activities" style="display: inline-block; background: #10B981; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; margin-top: 20px;">
                Buka Dashboard
              </a>
            </div>
          </div>
          `
        );
      }
    }

    // ========================================
    // 3. NOTIFIKASI 1 JAM SEBELUM
    // ========================================

    // Tasks 1 jam sebelum
    const { data: tasks1Hour } = await supabase
      .from("tasks")
      .select("*, user:user_id(email)")
      .eq("due_date", today)
      .eq("notified_1hour", false)
      .eq("is_done", false);

    for (const task of tasks1Hour || []) {
      const taskDateTime = new Date(`${task.due_date}T${task.due_time}`);
      const diffMinutes = (taskDateTime.getTime() - now.getTime()) / 1000 / 60;

      if (diffMinutes > 50 && diffMinutes <= 70) {
        const email = task.user?.email;
        if (!email) continue;

        await sendEmail(
          email,
          "🚨 Deadline 1 Jam Lagi! - Organizo",
          `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #EF4444 0%, #DC2626 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
              <h1 style="color: white; margin: 0;">🚨 Deadline Mendekat!</h1>
            </div>
            <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px;">
              <p style="font-size: 16px; color: #374151;">Halo,</p>
              <p style="font-size: 16px; color: #374151;">Tugas ini deadline-nya <strong>1 jam lagi</strong>:</p>
              
              <div style="background: white; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #EF4444;">
                <h2 style="color: #111827; margin: 0 0 10px 0;">${task.title}</h2>
                <p style="color: #EF4444; font-weight: bold; margin: 0;">
                  ⏰ Deadline: ${formatTime(task.due_time)}
                </p>
              </div>
              
              <p style="font-size: 14px; color: #6B7280;">Segera selesaikan sebelum terlambat! ⚡</p>
              <a href="https://organizo-taskmanager.vercel.app/app/tasks" style="display: inline-block; background: #EF4444; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; margin-top: 20px;">
                Kerjakan Sekarang
              </a>
            </div>
          </div>
          `
        );

        await supabase
          .from("tasks")
          .update({ notified_1hour: true })
          .eq("id", task.id);
      }
    }

    // Activities 1 jam sebelum
    const { data: activities1Hour } = await supabase
      .from("activities")
      .select("*, user:user_id(email)")
      .eq("activity_date", today)
      .eq("notified_1hour", false)
      .eq("is_completed", false);

    for (const activity of activities1Hour || []) {
      const activityDateTime = new Date(
        `${activity.activity_date}T${activity.start_time}`
      );
      const diffMinutes =
        (activityDateTime.getTime() - now.getTime()) / 1000 / 60;

      if (diffMinutes > 50 && diffMinutes <= 70) {
        const email = activity.user?.email;
        if (!email) continue;

        await sendEmail(
          email,
          "🚨 Kegiatan 1 Jam Lagi! - Organizo",
          `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #F59E0B 0%, #D97706 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
              <h1 style="color: white; margin: 0;">🚨 Kegiatan Segera Dimulai!</h1>
            </div>
            <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px;">
              <p style="font-size: 16px; color: #374151;">Halo,</p>
              <p style="font-size: 16px; color: #374151;">Kegiatan ini akan dimulai <strong>1 jam lagi</strong>:</p>
              
              <div style="background: white; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #F59E0B;">
                <h2 style="color: #111827; margin: 0 0 10px 0;">${activity.title}</h2>
                <p style="color: #F59E0B; font-weight: bold; margin: 0;">
                  ⏰ Mulai: ${formatTime(activity.start_time)}
                  ${activity.location ? ` | 📍 ${activity.location}` : ""}
                </p>
              </div>
              
              <p style="font-size: 14px; color: #6B7280;">Bersiap-siaplah! 🎯</p>
              <a href="https://organizo-taskmanager.vercel.app/app/tasks" style="display: inline-block; background: #F59E0B; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; margin-top: 20px;">
                Lihat Detail
              </a>
            </div>
          </div>
          `
        );

        await supabase
          .from("activities")
          .update({ notified_1hour: true })
          .eq("id", activity.id);
      }
    }

    return new Response(
      JSON.stringify({ success: true, message: "Notifications sent" }),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});
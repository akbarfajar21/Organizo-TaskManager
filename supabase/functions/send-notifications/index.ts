import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_KEY = Deno.env.get("SERVICE_KEY");

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
      from: "Organizo Task Manager <organizotaskmanager@gmail.com>", // Pastikan alamat ini valid
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
      const email = task.user?.email;  // Ambil email dari user terkait
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
      const email = activity.user?.email;  // Ambil email dari user terkait
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

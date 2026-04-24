import { Resend } from "resend"

let _resend: Resend | null = null

function getResend(): Resend {
    if (!process.env.RESEND_API_KEY) {
        throw new Error("RESEND_API_KEY is not configured")
    }
    if (!_resend) {
        _resend = new Resend(process.env.RESEND_API_KEY)
    }
    return _resend
}

const FROM_EMAIL = "ICPP Conformité <dev@code-talent.fr>"

interface SendPasswordResetEmailParams {
    to: string
    resetUrl: string
    userName?: string
}

export async function sendPasswordResetEmail({
    to,
    resetUrl,
    userName,
}: SendPasswordResetEmailParams) {
    try {
        const { data, error } = await getResend().emails.send({
            from: FROM_EMAIL,
            to: [to],
            subject: "Réinitialisation de votre mot de passe - ICPP",
            html: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #f4f4f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f5; padding: 40px 20px;">
        <tr>
            <td align="center">
                <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                    <!-- Header -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); padding: 32px; text-align: center;">
                            <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 700;">ICPP Conformité</h1>
                        </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                        <td style="padding: 40px 32px;">
                            <h2 style="margin: 0 0 16px 0; color: #18181b; font-size: 20px; font-weight: 600;">
                                Réinitialisation de mot de passe
                            </h2>
                            
                            <p style="margin: 0 0 24px 0; color: #52525b; font-size: 16px; line-height: 1.6;">
                                Bonjour${userName ? ` ${userName}` : ""},
                            </p>
                            
                            <p style="margin: 0 0 24px 0; color: #52525b; font-size: 16px; line-height: 1.6;">
                                Vous avez demandé la réinitialisation de votre mot de passe. Cliquez sur le bouton ci-dessous pour créer un nouveau mot de passe :
                            </p>
                            
                            <table width="100%" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td align="center" style="padding: 16px 0 32px 0;">
                                        <a href="${resetUrl}" style="display: inline-block; background-color: #2563eb; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-size: 16px; font-weight: 600;">
                                            Réinitialiser mon mot de passe
                                        </a>
                                    </td>
                                </tr>
                            </table>
                            
                            <p style="margin: 0 0 16px 0; color: #71717a; font-size: 14px; line-height: 1.6;">
                                Ce lien est valide pendant <strong>1 heure</strong>. Si vous n'avez pas demandé cette réinitialisation, vous pouvez ignorer cet email.
                            </p>
                            
                            <p style="margin: 0; color: #71717a; font-size: 14px; line-height: 1.6;">
                                Si le bouton ne fonctionne pas, copiez ce lien dans votre navigateur :<br>
                                <a href="${resetUrl}" style="color: #2563eb; word-break: break-all;">${resetUrl}</a>
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #f4f4f5; padding: 24px 32px; text-align: center;">
                            <p style="margin: 0; color: #71717a; font-size: 12px;">
                                © 2026 ICPP Conformité. Tous droits réservés.
                            </p>
                            <p style="margin: 8px 0 0 0; color: #a1a1aa; font-size: 12px;">
                                La Réunion, France
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
            `,
        })

        if (error) {
            console.error("Resend error:", error)
            return { success: false, error: error.message }
        }

        console.log("Password reset email sent:", data)
        return { success: true, data }
    } catch (error) {
        console.error("Email sending error:", error)
        return { success: false, error: "Failed to send email" }
    }
}

// ============================================
// RAPPELS DUERP
// ============================================

interface DuerpReminderClientParams {
    to: string
    companyName: string
    contactName?: string
    duerpCreatedAt: Date
    daysSinceUpdate: number
    appUrl: string
}

export async function sendDuerpReminderToClient({
    to,
    companyName,
    contactName,
    duerpCreatedAt,
    daysSinceUpdate,
    appUrl,
}: DuerpReminderClientParams) {
    const isOverdue = daysSinceUpdate >= 365
    const subject = isOverdue
        ? `⚠️ URGENT — Votre DUERP est expiré — ${companyName}`
        : `📋 Rappel — Votre DUERP arrive à échéance — ${companyName}`

    try {
        const { data, error } = await getResend().emails.send({
            from: FROM_EMAIL,
            to: [to],
            subject,
            html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background-color:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f5;padding:40px 20px;">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 6px rgba(0,0,0,0.1);">
        <tr>
          <td style="background:linear-gradient(135deg,${isOverdue ? "#dc2626 0%,#b91c1c" : "#f59e0b 0%,#d97706"} 100%);padding:32px;text-align:center;">
            <h1 style="margin:0;color:#ffffff;font-size:22px;font-weight:700;">ICPP Conformité</h1>
            <p style="margin:8px 0 0;color:rgba(255,255,255,0.85);font-size:14px;">
              ${isOverdue ? "⚠️ Action requise — DUERP expiré" : "📋 Rappel de mise à jour DUERP"}
            </p>
          </td>
        </tr>
        <tr>
          <td style="padding:40px 32px;">
            <h2 style="margin:0 0 16px;color:#18181b;font-size:20px;font-weight:600;">
              Bonjour${contactName ? ` ${contactName}` : ""},
            </h2>
            <p style="margin:0 0 20px;color:#52525b;font-size:16px;line-height:1.6;">
              ${isOverdue
                  ? `Le Document Unique d'Évaluation des Risques Professionnels (DUERP) de <strong>${companyName}</strong> est <strong style="color:#dc2626;">en retard de mise à jour</strong> (${daysSinceUpdate} jours depuis la dernière révision).`
                  : `Le Document Unique d'Évaluation des Risques Professionnels (DUERP) de <strong>${companyName}</strong> devra être mis à jour dans moins de <strong>30 jours</strong>. La dernière version remonte au ${new Date(duerpCreatedAt).toLocaleDateString("fr-FR")}.`
              }
            </p>
            <p style="margin:0 0 24px;color:#52525b;font-size:15px;line-height:1.6;">
              La mise à jour annuelle du DUERP est une <strong>obligation légale</strong> (Article R4121-2 du Code du travail). Notre équipe ICPP est disponible pour vous accompagner.
            </p>
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td align="center" style="padding:8px 0 32px;">
                  <a href="${appUrl}/dashboard" style="display:inline-block;background-color:${isOverdue ? "#dc2626" : "#f59e0b"};color:#ffffff;text-decoration:none;padding:14px 32px;border-radius:8px;font-size:16px;font-weight:600;">
                    Accéder à mon espace
                  </a>
                </td>
              </tr>
            </table>
            <p style="margin:0;color:#71717a;font-size:13px;line-height:1.6;">
              Pour toute question, contactez-nous à <a href="mailto:contact@icpp-conformite.cloud" style="color:#2563eb;">contact@icpp-conformite.cloud</a>.
            </p>
          </td>
        </tr>
        <tr>
          <td style="background-color:#f4f4f5;padding:20px 32px;text-align:center;">
            <p style="margin:0;color:#a1a1aa;font-size:12px;">© 2026 ICPP Conformité · La Réunion, France</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`,
        })
        if (error) return { success: false, error: error.message }
        return { success: true, data }
    } catch (e) {
        console.error("sendDuerpReminderToClient error:", e)
        return { success: false, error: "Failed to send email" }
    }
}

interface DuerpSummaryItem {
    companyName: string
    daysSinceUpdate: number
    contactEmail: string
}

interface DuerpSummaryAuditorParams {
    to: string
    auditorName: string
    companies: DuerpSummaryItem[]
    appUrl: string
}

export async function sendDuerpSummaryToAuditor({
    to,
    auditorName,
    companies,
    appUrl,
}: DuerpSummaryAuditorParams) {
    const overdueCount = companies.filter(c => c.daysSinceUpdate >= 365).length
    try {
        const { data, error } = await getResend().emails.send({
            from: FROM_EMAIL,
            to: [to],
            subject: `ICPP — Récapitulatif rappels DUERP (${companies.length} entreprise${companies.length > 1 ? "s" : ""})`,
            html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background-color:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f5;padding:40px 20px;">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:640px;background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 6px rgba(0,0,0,0.1);">
        <tr>
          <td style="background:linear-gradient(135deg,#2563eb 0%,#1d4ed8 100%);padding:32px;text-align:center;">
            <h1 style="margin:0;color:#ffffff;font-size:22px;font-weight:700;">ICPP Conformité</h1>
            <p style="margin:8px 0 0;color:rgba(255,255,255,0.85);font-size:14px;">Récapitulatif automatique — Rappels DUERP</p>
          </td>
        </tr>
        <tr>
          <td style="padding:32px;">
            <p style="margin:0 0 8px;color:#18181b;font-size:16px;">Bonjour <strong>${auditorName}</strong>,</p>
            <p style="margin:0 0 24px;color:#52525b;font-size:15px;line-height:1.6;">
              Voici le récapitulatif des <strong>${companies.length} entreprise${companies.length > 1 ? "s" : ""}</strong> dont le DUERP nécessite une attention particulière 
              (<strong style="color:#dc2626;">${overdueCount} expiré${overdueCount > 1 ? "s" : ""}</strong>).
            </p>
            <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e2e8f0;border-radius:8px;overflow:hidden;">
              <tr style="background-color:#f8fafc;">
                <th style="padding:10px 16px;text-align:left;font-size:12px;font-weight:600;color:#64748b;text-transform:uppercase;">Entreprise</th>
                <th style="padding:10px 16px;text-align:left;font-size:12px;font-weight:600;color:#64748b;text-transform:uppercase;">Jours écoulés</th>
                <th style="padding:10px 16px;text-align:left;font-size:12px;font-weight:600;color:#64748b;text-transform:uppercase;">Statut</th>
              </tr>
              ${companies.map((c, i) => `
              <tr style="border-top:1px solid #f1f5f9;background-color:${i % 2 === 0 ? "#ffffff" : "#fafafa"};">
                <td style="padding:12px 16px;font-size:14px;color:#1e293b;font-weight:500;">${c.companyName}</td>
                <td style="padding:12px 16px;font-size:14px;color:#64748b;">${c.daysSinceUpdate} jours</td>
                <td style="padding:12px 16px;">
                  <span style="display:inline-block;padding:3px 10px;border-radius:999px;font-size:12px;font-weight:600;background-color:${c.daysSinceUpdate >= 365 ? "#fef2f2" : "#fffbeb"};color:${c.daysSinceUpdate >= 365 ? "#dc2626" : "#d97706"};">
                    ${c.daysSinceUpdate >= 365 ? "Expiré" : "À renouveler"}
                  </span>
                </td>
              </tr>`).join("")}
            </table>
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr><td align="center" style="padding:28px 0 8px;">
                <a href="${appUrl}/admin/duerp" style="display:inline-block;background-color:#2563eb;color:#ffffff;text-decoration:none;padding:12px 28px;border-radius:8px;font-size:15px;font-weight:600;">
                  Accéder aux DUERP
                </a>
              </td></tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="background-color:#f4f4f5;padding:20px 32px;text-align:center;">
            <p style="margin:0;color:#a1a1aa;font-size:12px;">© 2026 ICPP Conformité · Envoi automatique</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`,
        })
        if (error) return { success: false, error: error.message }
        return { success: true, data }
    } catch (e) {
        console.error("sendDuerpSummaryToAuditor error:", e)
        return { success: false, error: "Failed to send email" }
    }
}

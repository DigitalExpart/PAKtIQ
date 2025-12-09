import * as Print from 'expo-print';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { Platform } from 'react-native';

export interface PaktExportData {
  id: string;
  name: string;
  description: string;
  category: string;
  deadline: string;
  progress: number;
  status: string;
  milestones?: Array<{
    name: string;
    due_date: string;
    completed: boolean;
    notes?: string;
  }>;
}

export class ExportService {
  /**
   * Generate PDF HTML for a pakt
   */
  private static generatePaktPDFHTML(pakt: PaktExportData): string {
    const completedMilestones = pakt.milestones?.filter(m => m.completed).length || 0;
    const totalMilestones = pakt.milestones?.length || 0;
    const deadlineDate = new Date(pakt.deadline).toLocaleDateString();

    const milestonesHTML = pakt.milestones
      ?.map(
        (m, index) => `
        <div style="margin-bottom: 12px; padding: 12px; background: #f5f5f5; border-radius: 8px;">
          <div style="display: flex; align-items: center; margin-bottom: 4px;">
            <span style="margin-right: 8px; font-size: 18px;">${m.completed ? '✅' : '⏳'}</span>
            <strong style="flex: 1;">Milestone ${index + 1}: ${m.name}</strong>
          </div>
          <div style="font-size: 12px; color: #666; margin-left: 26px;">
            Due: ${new Date(m.due_date).toLocaleDateString()}
            ${m.notes ? ` | Notes: ${m.notes}` : ''}
          </div>
        </div>
      `
      )
      .join('') || '<p style="color: #999;">No milestones yet</p>';

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              padding: 40px;
              color: #333;
              max-width: 800px;
              margin: 0 auto;
            }
            .header {
              text-align: center;
              margin-bottom: 40px;
              padding-bottom: 20px;
              border-bottom: 3px solid #9163F2;
            }
            .logo {
              font-size: 32px;
              font-weight: bold;
              color: #9163F2;
              margin-bottom: 8px;
            }
            .pakt-name {
              font-size: 28px;
              font-weight: bold;
              color: #1a1625;
              margin-bottom: 16px;
            }
            .info-grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 16px;
              margin-bottom: 32px;
            }
            .info-item {
              padding: 16px;
              background: #f9f9f9;
              border-radius: 8px;
            }
            .info-label {
              font-size: 12px;
              color: #666;
              text-transform: uppercase;
              margin-bottom: 4px;
            }
            .info-value {
              font-size: 16px;
              font-weight: 600;
              color: #1a1625;
            }
            .progress-bar {
              width: 100%;
              height: 24px;
              background: #e0e0e0;
              border-radius: 12px;
              overflow: hidden;
              margin-top: 8px;
            }
            .progress-fill {
              height: 100%;
              background: linear-gradient(90deg, #9163F2, #96E6B3);
              display: flex;
              align-items: center;
              justify-content: center;
              color: white;
              font-size: 12px;
              font-weight: bold;
            }
            .description {
              margin: 24px 0;
              padding: 20px;
              background: #f9f9f9;
              border-left: 4px solid #9163F2;
              border-radius: 4px;
            }
            .milestones-section {
              margin-top: 32px;
            }
            .section-title {
              font-size: 20px;
              font-weight: bold;
              color: #1a1625;
              margin-bottom: 16px;
              padding-bottom: 8px;
              border-bottom: 2px solid #e0e0e0;
            }
            .footer {
              margin-top: 40px;
              padding-top: 20px;
              border-top: 1px solid #e0e0e0;
              text-align: center;
              font-size: 12px;
              color: #999;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo">Resolute Plan</div>
            <div class="pakt-name">${pakt.name}</div>
          </div>

          <div class="info-grid">
            <div class="info-item">
              <div class="info-label">Category</div>
              <div class="info-value">${pakt.category}</div>
            </div>
            <div class="info-item">
              <div class="info-label">Status</div>
              <div class="info-value">${pakt.status.charAt(0).toUpperCase() + pakt.status.slice(1)}</div>
            </div>
            <div class="info-item">
              <div class="info-label">Deadline</div>
              <div class="info-value">${deadlineDate}</div>
            </div>
            <div class="info-item">
              <div class="info-label">Progress</div>
              <div class="info-value">${pakt.progress}%</div>
              <div class="progress-bar">
                <div class="progress-fill" style="width: ${pakt.progress}%;">
                  ${pakt.progress}%
                </div>
              </div>
            </div>
          </div>

          <div class="description">
            <strong>Description:</strong><br/>
            ${pakt.description || 'No description provided'}
          </div>

          <div class="milestones-section">
            <div class="section-title">
              Milestones (${completedMilestones}/${totalMilestones} completed)
            </div>
            ${milestonesHTML}
          </div>

          <div class="footer">
            Generated by Resolute Plan on ${new Date().toLocaleDateString()}
          </div>
        </body>
      </html>
    `;
  }

  /**
   * Export a single pakt to PDF
   */
  static async exportPaktToPDF(pakt: PaktExportData): Promise<void> {
    try {
      const html = this.generatePaktPDFHTML(pakt);
      
      const { uri } = await Print.printToFileAsync({
        html,
        base64: false,
      });

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri, {
          mimeType: 'application/pdf',
          dialogTitle: `Export ${pakt.name}`,
        });
      } else {
        throw new Error('Sharing is not available on this device');
      }
    } catch (error) {
      console.error('Error exporting PDF:', error);
      throw error;
    }
  }

  /**
   * Export multiple pakts to PDF
   */
  static async exportPaktsToPDF(pakts: PaktExportData[]): Promise<void> {
    try {
      const html = pakts
        .map((pakt, index) => {
          const paktHTML = this.generatePaktPDFHTML(pakt);
          if (index > 0) {
            return `<div style="page-break-before: always;">${paktHTML}</div>`;
          }
          return paktHTML;
        })
        .join('');

      const { uri } = await Print.printToFileAsync({
        html,
        base64: false,
      });

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri, {
          mimeType: 'application/pdf',
          dialogTitle: `Export ${pakts.length} Pakts`,
        });
      } else {
        throw new Error('Sharing is not available on this device');
      }
    } catch (error) {
      console.error('Error exporting PDFs:', error);
      throw error;
    }
  }
}

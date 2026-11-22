import os
import re
from xml.sax.saxutils import escape
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, HRFlowable, Image
)
from reportlab.pdfgen import canvas

NAVY_PRIMARY = colors.HexColor("#0c2340")
NAVY_SECONDARY = colors.HexColor("#1e3a8a")
TEAL_ACCENT = colors.HexColor("#0284c7")
GREEN_ACCENT = colors.HexColor("#059669")
TEXT_DARK = colors.HexColor("#0f172a")
TEXT_MUTED = colors.HexColor("#475569")
BORDER_LIGHT = colors.HexColor("#cbd5e1")
BG_LIGHT = colors.HexColor("#f8fafc")

class D12NumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super(D12NumberedCanvas, self).__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_decorations(num_pages)
            super(D12NumberedCanvas, self).showPage()
        super(D12NumberedCanvas, self).save()

    def draw_page_decorations(self, page_count):
        self.saveState()
        self.setFont("Helvetica-Bold", 8)
        self.setFillColor(TEXT_MUTED)
        
        # Header (pages after page 1)
        if self._pageNumber > 1:
            self.drawString(54, letter[1] - 36, "Assam State Space Application Centre (ASSAC) • Dept of Science & Technology • NESFIC-D-12")
            self.drawRightString(letter[0] - 54, letter[1] - 36, "SasyaDrishti — Ron Hatibaruah")
            self.setStrokeColor(BORDER_LIGHT)
            self.setLineWidth(0.5)
            self.line(54, letter[1] - 42, letter[0] - 54, letter[1] - 42)

        # Footer (all pages)
        self.setStrokeColor(BORDER_LIGHT)
        self.setLineWidth(0.5)
        self.line(54, 45, letter[0] - 54, 45)
        self.drawString(54, 32, "NESFIC 2026 Proposal • Problem NESFIC-D-12: Crop Yield & Production Estimation")
        self.drawRightString(letter[0] - 54, 32, f"Page {self._pageNumber} of {page_count}")
        self.restoreState()

def clean_inline_text(text):
    if not text:
        return ""
    t = text.strip()
    # Replacements for safe rendering
    t = t.replace('₹', 'Rs. ')
    t = t.replace('শস্য দৃষ্টি', 'SasyaDrishti')
    t = t.replace('–', '-').replace('—', ' - ')
    t = t.replace('’', "'").replace('‘', "'").replace('“', '"').replace('”', '"')
    t = t.replace('≤', '<=').replace('≥', '>=').replace('±', '+/-')
    t = t.replace('×', 'x')
    
    # Escape XML
    t = escape(t)
    
    # Re-apply HTML tags for bold/italics/code
    t = re.sub(r'\*\*\*(.*?)\*\*\*', r'<b><i>\1</i></b>', t)
    t = re.sub(r'\*\*(.*?)\*\*', r'<b>\1</b>', t)
    t = re.sub(r'\*(.*?)\*', r'<i>\1</i>', t)
    t = re.sub(r'`(.*?)`', r'<font face="Courier" color="#1e3a8a">\1</font>', t)
    return t

def setup_styles():
    styles = getSampleStyleSheet()
    
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=20,
        leading=24,
        textColor=NAVY_PRIMARY,
        spaceAfter=6
    )
    
    subtitle_style = ParagraphStyle(
        'DocSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=10,
        leading=14,
        textColor=TEXT_MUTED,
        spaceAfter=12
    )

    h1_style = ParagraphStyle(
        'SectionH1',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=13,
        leading=16,
        textColor=NAVY_PRIMARY,
        spaceBefore=14,
        spaceAfter=6,
        keepWithNext=True
    )

    h2_style = ParagraphStyle(
        'SectionH2',
        parent=styles['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=11,
        leading=14,
        textColor=NAVY_SECONDARY,
        spaceBefore=8,
        spaceAfter=4,
        keepWithNext=True
    )

    h3_style = ParagraphStyle(
        'SectionH3',
        parent=styles['Heading3'],
        fontName='Helvetica-Bold',
        fontSize=9.5,
        leading=12,
        textColor=TEAL_ACCENT,
        spaceBefore=6,
        spaceAfter=3,
        keepWithNext=True
    )

    body_style = ParagraphStyle(
        'Body',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=12.5,
        textColor=TEXT_DARK,
        spaceAfter=5
    )

    bullet_style = ParagraphStyle(
        'Bullet',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.5,
        leading=11.5,
        textColor=TEXT_DARK,
        leftIndent=14,
        firstLineIndent=-10,
        spaceAfter=3
    )

    table_cell_style = ParagraphStyle(
        'TableCell',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=7.5,
        leading=9.5,
        textColor=TEXT_DARK
    )

    table_header_style = ParagraphStyle(
        'TableHeader',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=7.5,
        leading=9.5,
        textColor=colors.white
    )

    meta_banner_style = ParagraphStyle(
        'MetaBanner',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8,
        leading=11,
        textColor=TEXT_MUTED
    )

    return {
        'title': title_style,
        'subtitle': subtitle_style,
        'h1': h1_style,
        'h2': h2_style,
        'h3': h3_style,
        'body': body_style,
        'bullet': bullet_style,
        'table_cell': table_cell_style,
        'table_header': table_header_style,
        'meta_banner': meta_banner_style
    }

def parse_markdown_blocks(lines, styles, avail_width=504):
    flowables = []
    i = 0
    while i < len(lines):
        line = lines[i].strip()
        if not line:
            i += 1
            continue

        # Markdown Table Detection
        if line.startswith('|') and i + 1 < len(lines) and '|' in lines[i+1] and '-' in lines[i+1]:
            table_lines = [line]
            i += 1
            while i < len(lines) and lines[i].strip().startswith('|'):
                table_lines.append(lines[i].strip())
                i += 1
            
            # Parse table
            headers = [c.strip() for c in table_lines[0].split('|')[1:-1]]
            rows_data = []
            for t_line in table_lines[2:]:
                cells = [c.strip() for c in t_line.split('|')[1:-1]]
                if cells:
                    rows_data.append(cells)
            
            col_count = len(headers)
            if col_count > 0:
                col_w = avail_width / col_count
                t_matrix = []
                # Header row
                h_row = [Paragraph(clean_inline_text(h), styles['table_header']) for h in headers]
                t_matrix.append(h_row)
                for r in rows_data:
                    # Pad if cells mismatch
                    padded = r + [''] * (col_count - len(r))
                    row_cells = [Paragraph(clean_inline_text(c), styles['table_cell']) for c in padded[:col_count]]
                    t_matrix.append(row_cells)
                
                tbl = Table(t_matrix, colWidths=[col_w]*col_count)
                tbl.setStyle(TableStyle([
                    ('BACKGROUND', (0,0), (-1,0), NAVY_PRIMARY),
                    ('TEXTCOLOR', (0,0), (-1,0), colors.white),
                    ('ALIGN', (0,0), (-1,-1), 'LEFT'),
                    ('VALIGN', (0,0), (-1,-1), 'TOP'),
                    ('GRID', (0,0), (-1,-1), 0.5, BORDER_LIGHT),
                    ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, BG_LIGHT]),
                    ('TOPPADDING', (0,0), (-1,-1), 3),
                    ('BOTTOMPADDING', (0,0), (-1,-1), 3),
                    ('LEFTPADDING', (0,0), (-1,-1), 4),
                    ('RIGHTPADDING', (0,0), (-1,-1), 4),
                ]))
                flowables.append(Spacer(1, 4))
                flowables.append(tbl)
                flowables.append(Spacer(1, 4))
            continue

        # Code block (preformatted / ASCII architecture)
        if line.startswith('```'):
            i += 1
            code_lines = []
            while i < len(lines) and not lines[i].strip().startswith('```'):
                code_lines.append(lines[i])
                i += 1
            i += 1  # Skip closing ```
            code_str = "\n".join(code_lines)
            code_style = ParagraphStyle(
                'AsciiBox',
                parent=styles['body'],
                fontName='Courier',
                fontSize=6.5,
                leading=8,
                textColor=NAVY_PRIMARY
            )
            flowables.append(Spacer(1, 3))
            flowables.append(Paragraph(f"<pre>{escape(code_str)}</pre>", code_style))
            flowables.append(Spacer(1, 3))
            continue

        # Headers
        if line.startswith('### '):
            flowables.append(Paragraph(clean_inline_text(line[4:]), styles['h2']))
        elif line.startswith('#### '):
            flowables.append(Paragraph(clean_inline_text(line[5:]), styles['h3']))
        elif line.startswith('## '):
            flowables.append(HRFlowable(width="100%", thickness=1, color=NAVY_SECONDARY, spaceBefore=8, spaceAfter=4))
            flowables.append(Paragraph(clean_inline_text(line[3:]), styles['h1']))
        elif line.startswith('# '):
            flowables.append(Paragraph(clean_inline_text(line[2:]), styles['title']))
        # Horizontal rule
        elif line.startswith('---'):
            flowables.append(HRFlowable(width="100%", thickness=0.5, color=BORDER_LIGHT, spaceBefore=4, spaceAfter=4))
        # Bullet item
        elif line.startswith('- ') or line.startswith('* ') or re.match(r'^\d+\.\s+', line):
            # Clean lead
            item_text = re.sub(r'^([-*]|\d+\.)\s+', '', line)
            bullet_sym = '• ' if line.startswith(('-', '*')) else f"{line.split()[0]} "
            flowables.append(Paragraph(f"{bullet_sym}{clean_inline_text(item_text)}", styles['bullet']))
        else:
            # Paragraph
            flowables.append(Paragraph(clean_inline_text(line), styles['body']))
        
        i += 1
    return flowables

def build_pdf(md_filename, pdf_filename, doc_title, subtitle):
    base_dir = os.path.dirname(os.path.abspath(__file__))
    md_path = os.path.join(base_dir, md_filename)
    pdf_path = os.path.join(base_dir, pdf_filename)
    
    with open(md_path, 'r', encoding='utf-8') as f:
        md_text = f.read()
    
    doc = SimpleDocTemplate(
        pdf_path,
        pagesize=letter,
        leftMargin=54,
        rightMargin=54,
        topMargin=54,
        bottomMargin=54
    )
    
    styles = setup_styles()
    story = []
    
    # Title Banner Box
    banner_data = [
        [
            Paragraph(f"<b>{escape(doc_title)}</b>", styles['title']),
            Paragraph(f"<b>NESFIC 2026</b><br/>Govt of Assam<br/>Dept of Science & Tech / ASSAC", styles['meta_banner'])
        ],
        [
            Paragraph(escape(subtitle), styles['subtitle']),
            Paragraph("Applicant: <b>Ron Hatibaruah</b><br/>Status: <b>Verified & Edge-Deployed</b>", styles['meta_banner'])
        ]
    ]
    banner_table = Table(banner_data, colWidths=[380, 124])
    banner_table.setStyle(TableStyle([
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('BOTTOMPADDING', (0,0), (-1,-1), 2),
        ('TOPPADDING', (0,0), (-1,-1), 2),
        ('LEFTPADDING', (0,0), (-1,-1), 0),
        ('RIGHTPADDING', (0,0), (-1,-1), 0),
    ]))
    story.append(banner_table)
    story.append(HRFlowable(width="100%", thickness=1.5, color=NAVY_PRIMARY, spaceBefore=4, spaceAfter=8))
    
    lines = md_text.split('\n')
    # Filter out initial H1 if duplicate
    if lines and lines[0].startswith('# '):
        lines = lines[1:]
    
    body_flowables = parse_markdown_blocks(lines, styles, avail_width=504)
    story.extend(body_flowables)
    
    doc.build(story, canvasmaker=D12NumberedCanvas)
    size_mb = os.path.getsize(pdf_path) / (1024 * 1024)
    print(f"Successfully generated {pdf_path} ({size_mb:.2f} MB)")

if __name__ == '__main__':
    # 1. Proposal PDF
    build_pdf(
        'proposal_contents.md',
        'NESFIC_D12_Proposal_Ron_Hatibaruah.pdf',
        'SasyaDrishti (শস্য দৃষ্টি) — NESFIC-D-12 Proposal',
        'AI-Powered Crop Yield & Production Estimation Platform Using Satellite/UAV & Field Data'
    )
    
    # 2. Proof of Work Dossier PDF
    build_pdf(
        'proof_of_work_dossier.md',
        'NESFIC_D12_Proof_of_Work_Ron_Hatibaruah.pdf',
        'NESFIC-D-12 Proof of Work & Solution Evidence Dossier',
        'Empirical Testing, Deployed System Architecture, Mathematical Formulations & Wireframes'
    )

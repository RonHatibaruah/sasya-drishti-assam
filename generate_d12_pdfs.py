import os
import re
import hashlib
from xml.sax.saxutils import escape

# Set Matplotlib cache directory before importing matplotlib
os.environ["MPLCONFIGDIR"] = "/tmp/matplotlib-cache"
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt

from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, HRFlowable, Image
)
from reportlab.pdfgen import canvas

# Warm Agricultural Brown Theme Palette
BROWN_PRIMARY = colors.HexColor("#2d1b11")
BROWN_SECONDARY = colors.HexColor("#4a2c11")
WARM_AMBER = colors.HexColor("#78350f")
GOLD_ACCENT = colors.HexColor("#d97706")
TEXT_DARK = colors.HexColor("#1c1917")
TEXT_MUTED = colors.HexColor("#57534e")
BORDER_LIGHT = colors.HexColor("#d6d3d1")
BG_LIGHT = colors.HexColor("#fdfbf7")

FORMULA_CACHE_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'assets', 'formula_cache')
os.makedirs(FORMULA_CACHE_DIR, exist_ok=True)

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

def format_math_span(latex):
    s = latex.strip()
    s = re.sub(r'\\(?:text|mathrm|mathbf)\{([^}]+)\}', r'\1', s)
    s = s.replace(r'\lambda', '&lambda;')
    s = s.replace(r'\sigma', '&sigma;')
    s = s.replace(r'\le', '&le;')
    s = s.replace(r'\ge', '&ge;')
    s = s.replace(r'\approx', '&asymp;')
    s = s.replace(r'\times', '&times;')
    s = s.replace(r'\pm', '&plusmn;')
    s = s.replace(r'\sim', '~')
    
    # Handle comparisons FIRST so <sup> and <sub> tags are never escaped
    s = s.replace('<', '&lt;').replace('>', '&gt;')
    
    # Handle powers and subscripts
    s = re.sub(r'\^\{?([0-9a-zA-Z+-]+)\}?', r'<sup>\1</sup>', s)
    s = re.sub(r'_\{?([0-9a-zA-Z+-]+)\}?', r'<sub>\1</sub>', s)
    
    # Italicize standalone single variable letters
    s = re.sub(r'\b([RpnZME])\b', r'<i>\1</i>', s)
    return s

def clean_inline_text(text):
    if not text:
        return ""
    t = text.strip()
    t = t.replace('₹', 'Rs. ')
    t = t.replace('SasyaDrishti (শস্য দৃষ্টি)', 'SasyaDrishti')
    t = t.replace('(শস্য দৃষ্টি)', '(Sasya Drishti)')
    t = t.replace('শস্য দৃষ্টি', 'Sasya Drishti')
    t = t.replace('–', '-').replace('—', ' - ')
    t = t.replace('’', "'").replace('‘', "'").replace('“', '"').replace('”', '"')
    t = t.replace('≤', '&le;').replace('≥', '&ge;').replace('±', '&plusmn;')
    t = t.replace('×', '&times;').replace('≈', '&asymp;')
    
    # 1. Extract inline math $...$
    math_tokens = []
    def save_math(m):
        tok = f"___MATH_TOKEN_{len(math_tokens)}___"
        math_tokens.append(format_math_span(m.group(1)))
        return tok
        
    t = re.sub(r'\$([^\$]+)\$', save_math, t)
    
    # 2. Escape regular HTML entities (<, >, &)
    t = escape(t)
    
    # 3. Restore formatted math spans
    for i, tok_val in enumerate(math_tokens):
        t = t.replace(f"___MATH_TOKEN_{i}___", tok_val)
        
    # 4. Standard markdown bold/italic/code
    t = re.sub(r'\*\*\*(.*?)\*\*\*', r'<b><i>\1</i></b>', t)
    t = re.sub(r'\*\*(.*?)\*\*', r'<b>\1</b>', t)
    t = re.sub(r'\*(.*?)\*', r'<i>\1</i>', t)
    t = re.sub(r'`(.*?)`', r'<font face="Courier" color="#78350f">\1</font>', t)
    return t

def sanitize_latex_for_mathtext(latex_code):
    s = latex_code.strip()
    s = s.replace(r"\%", "%")
    def clean_text_block(m):
        content = m.group(1).replace("%", "")
        words = [w for w in content.split() if w]
        joined = r"\ ".join(words)
        res = r"\mathrm{" + joined + r"}"
        if "%" in m.group(1):
            res += r"\ \%"
        return res
        
    s = re.sub(r"\\(?:text|mathrm)\{([^}]+)\}", clean_text_block, s)
    s = re.sub(r"(?<!\\)%", r"\%", s)
    s = re.sub(r"(\d),(\d)", r"\1{,}\2", s)
    return s

def render_math_image(latex_code, text_color="#2d1b11", fontsize=12):
    sanitized = sanitize_latex_for_mathtext(latex_code)
    
    h = hashlib.md5(sanitized.encode('utf-8')).hexdigest()
    img_path = os.path.join(FORMULA_CACHE_DIR, f"eq_{h}.png")
    if not os.path.exists(img_path):
        fig = plt.figure(figsize=(6.4, 0.75), dpi=300)
        fig.patch.set_alpha(0.0)
        ax = fig.add_axes([0, 0, 1, 1])
        ax.axis("off")
        ax.text(0.5, 0.5, f"${sanitized}$", fontsize=fontsize, ha="center", va="center", color=text_color)
        plt.savefig(img_path, dpi=300, transparent=True)
        plt.close(fig)
    return img_path

def create_equation_flowable(latex_str, eq_num, styles, avail_width=504):
    try:
        img_path = render_math_image(latex_str)
        img_w = 415
        img_h = 36
        
        table_data = [
            [
                Image(img_path, width=img_w, height=img_h),
                Paragraph(f"<b>(Eq. {eq_num})</b>", styles['eq_num'])
            ]
        ]
        eq_table = Table(table_data, colWidths=[avail_width - 60, 60])
        eq_table.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,-1), BG_LIGHT),
            ('ALIGN', (0,0), (0,0), 'CENTER'),
            ('ALIGN', (1,0), (1,0), 'RIGHT'),
            ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
            ('LINELEFT', (0,0), (0,-1), 2.5, WARM_AMBER),
            ('BOX', (0,0), (-1,-1), 0.5, BORDER_LIGHT),
            ('TOPPADDING', (0,0), (-1,-1), 2),
            ('BOTTOMPADDING', (0,0), (-1,-1), 2),
            ('LEFTPADDING', (0,0), (-1,-1), 6),
            ('RIGHTPADDING', (0,0), (-1,-1), 8),
        ]))
        return [
            Spacer(1, 3),
            eq_table,
            Spacer(1, 4)
        ]
    except Exception as e:
        fallback_text = clean_inline_text(latex_str)
        return [
            Spacer(1, 3),
            Paragraph(f"<b>[Eq. {eq_num}]:</b> <i>{fallback_text}</i>", styles['body']),
            Spacer(1, 3)
        ]

def setup_styles():
    styles = getSampleStyleSheet()
    
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=18,
        leading=22,
        textColor=BROWN_PRIMARY,
        spaceAfter=5
    )
    
    subtitle_style = ParagraphStyle(
        'DocSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9.5,
        leading=13,
        textColor=TEXT_MUTED,
        spaceAfter=10
    )

    h1_style = ParagraphStyle(
        'SectionH1',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=12,
        leading=15,
        textColor=BROWN_PRIMARY,
        spaceBefore=12,
        spaceAfter=5,
        keepWithNext=True
    )

    h2_style = ParagraphStyle(
        'SectionH2',
        parent=styles['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=10.5,
        leading=13.5,
        textColor=WARM_AMBER,
        spaceBefore=7,
        spaceAfter=3,
        keepWithNext=True
    )

    h3_style = ParagraphStyle(
        'SectionH3',
        parent=styles['Heading3'],
        fontName='Helvetica-Bold',
        fontSize=9,
        leading=11.5,
        textColor=GOLD_ACCENT,
        spaceBefore=5,
        spaceAfter=2,
        keepWithNext=True
    )

    body_style = ParagraphStyle(
        'Body',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.5,
        leading=11.5,
        textColor=TEXT_DARK,
        spaceAfter=4
    )

    bullet_style = ParagraphStyle(
        'Bullet',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8,
        leading=11,
        textColor=TEXT_DARK,
        leftIndent=12,
        firstLineIndent=-8,
        spaceAfter=2.5
    )

    caption_style = ParagraphStyle(
        'Caption',
        parent=styles['Normal'],
        fontName='Helvetica-Oblique',
        fontSize=7.5,
        leading=9.5,
        textColor=TEXT_MUTED,
        alignment=1, # Centered
        spaceAfter=6
    )

    eq_num_style = ParagraphStyle(
        'EqNum',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8.5,
        leading=11,
        textColor=WARM_AMBER,
        alignment=2 # Right aligned
    )

    table_cell_style = ParagraphStyle(
        'TableCell',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=7.2,
        leading=9,
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
        'caption': caption_style,
        'eq_num': eq_num_style,
        'table_cell': table_cell_style,
        'table_header': table_header_style,
        'meta_banner': meta_banner_style
    }

def get_diagram_flowable(diagram_filename, caption_text, styles, width=490, height=275):
    img_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'assets', 'proposal_diagrams')
    img_path = os.path.join(img_dir, diagram_filename)
    if os.path.exists(img_path):
        return [
            Spacer(1, 4),
            Image(img_path, width=width, height=height),
            Spacer(1, 2),
            Paragraph(f"<b>Figure:</b> {caption_text}", styles['caption']),
            Spacer(1, 4)
        ]
    return []

def parse_markdown_blocks(lines, styles, avail_width=504):
    flowables = []
    i = 0
    eq_counter = 1
    
    while i < len(lines):
        line = lines[i].strip()
        if not line:
            i += 1
            continue

        # Display Math Block Detection ($$ ... $$)
        if line.startswith('$$'):
            eq_lines = [line]
            if not (line.endswith('$$') and len(line) > 2):
                i += 1
                while i < len(lines):
                    eq_lines.append(lines[i].strip())
                    if lines[i].strip().endswith('$$'):
                        break
                    i += 1
            raw_eq = " ".join(eq_lines)
            cleaned_eq = raw_eq.replace('$$', '').strip()
            flowables.extend(create_equation_flowable(cleaned_eq, eq_counter, styles, avail_width=avail_width))
            eq_counter += 1
            i += 1
            continue

        # Markdown Table Detection
        if line.startswith('|') and i + 1 < len(lines) and '|' in lines[i+1] and '-' in lines[i+1]:
            table_lines = [line]
            i += 1
            while i < len(lines) and lines[i].strip().startswith('|'):
                table_lines.append(lines[i].strip())
                i += 1
            
            headers = [c.strip() for c in table_lines[0].split('|')[1:-1]]
            rows_data = []
            for t_line in table_lines[2:]:
                cells = [c.strip() for c in t_line.split('|')[1:-1]]
                if cells:
                    rows_data.append(cells)
            
            col_count = len(headers)
            if col_count > 0:
                if col_count == 4 and any('Budget' in h or 'Allocation' in h for h in headers):
                    col_widths = [150, 60, 84, 210]
                else:
                    col_widths = [avail_width / col_count] * col_count
                t_matrix = []
                h_row = [Paragraph(clean_inline_text(h), styles['table_header']) for h in headers]
                t_matrix.append(h_row)
                for r in rows_data:
                    padded = r + [''] * (col_count - len(r))
                    row_cells = [Paragraph(clean_inline_text(c), styles['table_cell']) for c in padded[:col_count]]
                    t_matrix.append(row_cells)
                
                tbl = Table(t_matrix, colWidths=col_widths)
                tbl.setStyle(TableStyle([
                    ('BACKGROUND', (0,0), (-1,0), BROWN_PRIMARY),
                    ('TEXTCOLOR', (0,0), (-1,0), colors.white),
                    ('ALIGN', (0,0), (-1,-1), 'LEFT'),
                    ('VALIGN', (0,0), (-1,-1), 'TOP'),
                    ('GRID', (0,0), (-1,-1), 0.5, BORDER_LIGHT),
                    ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, BG_LIGHT]),
                    ('TOPPADDING', (0,0), (-1,-1), 2.5),
                    ('BOTTOMPADDING', (0,0), (-1,-1), 2.5),
                    ('LEFTPADDING', (0,0), (-1,-1), 3.5),
                    ('RIGHTPADDING', (0,0), (-1,-1), 3.5),
                ]))
                flowables.append(Spacer(1, 3))
                flowables.append(tbl)
                flowables.append(Spacer(1, 3))
            continue

        # Code block (preformatted / ASCII architecture)
        if line.startswith('```'):
            i += 1
            code_lines = []
            while i < len(lines) and not lines[i].strip().startswith('```'):
                c_line = lines[i]
                c_line = c_line.replace('─', '-').replace('━', '-').replace('│', '|').replace('┃', '|')
                c_line = c_line.replace('┌', '+').replace('┐', '+').replace('└', '+').replace('┘', '+')
                c_line = c_line.replace('├', '+').replace('┤', '+').replace('┬', '+').replace('┴', '+').replace('┼', '+')
                c_line = c_line.replace('▼', 'v').replace('▲', '^').replace('►', '>').replace('◄', '<')
                c_line = c_line.replace('•', '*').replace('…', '...')
                code_lines.append(c_line)
                i += 1
            i += 1
            code_str = "\n".join(code_lines)
            code_style = ParagraphStyle(
                'AsciiBox',
                parent=styles['body'],
                fontName='Courier',
                fontSize=6,
                leading=7.5,
                textColor=BROWN_PRIMARY
            )
            flowables.append(Spacer(1, 3))
            flowables.append(Paragraph(f"<pre>{escape(code_str)}</pre>", code_style))
            flowables.append(Spacer(1, 3))
            continue

        # Headers and Context-Aware Diagram Insertion
        if line.startswith('## '):
            sec_title = line[3:].strip()
            if '12. Resources' in sec_title:
                flowables.append(PageBreak())
            flowables.append(HRFlowable(width="100%", thickness=1, color=BROWN_SECONDARY, spaceBefore=8, spaceAfter=4))
            flowables.append(Paragraph(clean_inline_text(sec_title), styles['h1']))

            # Check if this section matches a diagram
            if '1. Problem understanding' in sec_title or '1. Problem Statement' in sec_title:
                flowables.extend(get_diagram_flowable('diagram_1_paradigm_shift.png', 'Operational Paradigm Shift: Conventional vs. SasyaDrishti Workflow', styles))
            elif '2. Proposed solution' in sec_title or 'Proposed Solution' in sec_title:
                flowables.extend(get_diagram_flowable('diagram_2_monsoon_sar_physics.png', 'All-Weather Remote Sensing: Sentinel-1 C-Band SAR Cloud Penetration Physics', styles))
            elif '3. Describe User Journey' in sec_title or 'User Journey' in sec_title:
                flowables.extend(get_diagram_flowable('diagram_3_smallholder_resolution_stack.png', 'Multi-Tier Spatial Resolution Stack: Space-borne to Centimeter Drone Sensors', styles))
            elif '4. Technology & solution architecture' in sec_title or 'System Architecture' in sec_title:
                flowables.extend(get_diagram_flowable('diagram_4_enterprise_system_architecture.png', 'SasyaDrishti 4-Tier End-to-End Enterprise System Architecture', styles))
            elif '5. Development methodology' in sec_title or 'Methodology' in sec_title:
                flowables.extend(get_diagram_flowable('diagram_5_cce_moisture_normalization_loop.png', 'Digital Crop Cutting Experiment (CCE) Moisture Standardization & AI Feedback Loop', styles))
            elif '6. Development timeline' in sec_title or 'Timeline' in sec_title:
                flowables.extend(get_diagram_flowable('diagram_6_indicative_gantt_roadmap.png', '12-Month Indicative Phased Roadmap Synchronized with Assam Agricultural Seasons', styles))
            elif '10. Security' in sec_title or 'Compliance' in sec_title:
                flowables.extend(get_diagram_flowable('diagram_7_verifiable_certificate_flow.png', 'Tamper-Proof Digital Certificate Trust Architecture with SHA-256 Hashing', styles))

        elif line.startswith('### '):
            flowables.append(Paragraph(clean_inline_text(line[4:]), styles['h2']))
        elif line.startswith('#### '):
            flowables.append(Paragraph(clean_inline_text(line[5:]), styles['h3']))
        elif line.startswith('# '):
            flowables.append(Paragraph(clean_inline_text(line[2:]), styles['title']))
        elif line.startswith('---'):
            flowables.append(HRFlowable(width="100%", thickness=0.5, color=BORDER_LIGHT, spaceBefore=4, spaceAfter=4))
        elif line.startswith('- ') or line.startswith('* ') or re.match(r'^\d+\.\s+', line):
            item_text = re.sub(r'^([-*]|\d+\.)\s+', '', line)
            bullet_sym = '• ' if line.startswith(('-', '*')) else f"{line.split()[0]} "
            flowables.append(Paragraph(f"{bullet_sym}{clean_inline_text(item_text)}", styles['bullet']))
        else:
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
            Paragraph(f"<b>{clean_inline_text(doc_title)}</b>", styles['title']),
            Paragraph(f"<b>NESFIC 2026</b><br/>Govt of Assam<br/>Dept of Science & Tech / ASSAC", styles['meta_banner'])
        ],
        [
            Paragraph(clean_inline_text(subtitle), styles['subtitle']),
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
    story.append(HRFlowable(width="100%", thickness=1.5, color=BROWN_PRIMARY, spaceBefore=4, spaceAfter=8))
    
    lines = md_text.split('\n')
    if lines and lines[0].startswith('# '):
        lines = lines[1:]
    
    body_flowables = parse_markdown_blocks(lines, styles, avail_width=504)
    story.extend(body_flowables)
    
    doc.build(story, canvasmaker=D12NumberedCanvas)
    size_mb = os.path.getsize(pdf_path) / (1024 * 1024)
    print(f"Successfully generated {pdf_path} ({size_mb:.2f} MB)")

if __name__ == '__main__':
    # 1. Proposal PDF with Embedded Infographics and Mathematical Formulas
    build_pdf(
        'proposal_contents.md',
        'NESFIC_D12_Proposal_Ron_Hatibaruah.pdf',
        'SasyaDrishti — NESFIC-D-12 Proposal',
        'AI-Powered Crop Yield & Production Estimation Platform Using Satellite/UAV & Field Data'
    )
    
    # 2. Proof of Work Dossier PDF with Embedded Infographics and Mathematical Formulations
    build_pdf(
        'proof_of_work_dossier.md',
        'NESFIC_D12_Proof_of_Work_Ron_Hatibaruah.pdf',
        'NESFIC-D-12 Proof of Work & Solution Evidence Dossier',
        'Empirical Testing, Deployed System Architecture, Mathematical Formulations & Wireframes'
    )

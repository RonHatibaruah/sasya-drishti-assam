import os
import matplotlib
matplotlib.use('Agg')
os.environ['MPLCONFIGDIR'] = '/tmp/matplotlib-cache'
import matplotlib.pyplot as plt
import matplotlib.patches as patches
from matplotlib.patches import FancyBboxPatch, Rectangle, Circle, Polygon, Arrow
import numpy as np

out_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'assets', 'proposal_diagrams')
os.makedirs(out_dir, exist_ok=True)

# Theme Palette Constants
BG_COLOR = '#fdfbf7'
DARK_BROWN = '#2d1b11'
MED_BROWN = '#4a2c11'
WARM_AMBER = '#78350f'
ACCENT_GOLD = '#d97706'
LIGHT_GOLD = '#fef3c7'
TEXT_DARK = '#1c1917'
TEXT_MUTED = '#57534e'
BORDER_COLOR = '#d6d3d1'
GREEN_SUCCESS = '#15803d'
LIGHT_GREEN = '#ecfdf5'
RED_ALERT = '#b91c1c'
LIGHT_RED = '#fef2f2'
BLUE_RADAR = '#0369a1'
LIGHT_BLUE = '#f0f9ff'

# -----------------------------------------------------------------------------
# DIAGRAM 1: Paradigm Shift (Conventional vs SasyaDrishti)
# -----------------------------------------------------------------------------
def create_diagram_1():
    fig, ax = plt.subplots(figsize=(12, 6.6), dpi=220)
    fig.patch.set_facecolor(BG_COLOR)
    ax.set_facecolor(BG_COLOR)
    ax.axis('off')

    # Main Title
    ax.text(0.5, 0.95, "OPERATIONAL PARADIGM SHIFT: CONVENTIONAL VS. SASYADRISHTI", 
            ha='center', va='center', fontsize=13, fontweight='bold', color=DARK_BROWN)
    ax.text(0.5, 0.90, "Government of Assam • Assam State Space Application Centre (ASSAC) • NESFIC-D-12", 
            ha='center', va='center', fontsize=9, color=ACCENT_GOLD)

    # Left Container: Conventional Approach
    box_left = FancyBboxPatch((0.04, 0.08), 0.43, 0.76, boxstyle="round,pad=0.02,rounding_size=0.025", 
                              facecolor=LIGHT_RED, edgecolor='#f87171', linewidth=1.8)
    ax.add_patch(box_left)
    ax.text(0.255, 0.80, "CONVENTIONAL WORKFLOW (REACTIVE & BLIND)", ha='center', va='center', 
            fontsize=10.5, fontweight='bold', color='#991b1b')

    left_steps = [
        ("1. Optical Cloud Blindness", "Sentinel-2 / Landsat blocked by 70-85% cloud cover.\nZero visibility for up to 80 days during Kharif Sali paddy.", '#fee2e2'),
        ("2. Smallholder Resolution Mismatch", "Coarse satellite pixels (250m-1km) cause severe mixed-pixel\nerrors across narrow Assam Bigha bunds and drainage channels.", '#fee2e2'),
        ("3. Manual Paper CCE Bottleneck", "Sparse 5m x 5m quadrant cuts recorded on paper.\nTakes 3 to 4 months post-harvest to aggregate & validate.", '#fecaca'),
        ("4. Delayed Decisions & Disputes", "Procurement planning by FCI/AFCSCL severely delayed;\nContentious PMFBY flood loss claims and farmer distress.", '#fca5a5')
    ]
    for idx, (title, desc, bg) in enumerate(left_steps):
        y = 0.67 - idx * 0.17
        step_box = FancyBboxPatch((0.06, y - 0.05), 0.39, 0.13, boxstyle="round,pad=0.01,rounding_size=0.02",
                                  facecolor=bg, edgecolor='#ef4444', linewidth=1)
        ax.add_patch(step_box)
        ax.text(0.08, y + 0.035, title, fontsize=8.8, fontweight='bold', color='#7f1d1d')
        ax.text(0.08, y - 0.015, desc, fontsize=7.4, color='#450a0a', linespacing=1.2)

    # Right Container: SasyaDrishti Solution
    box_right = FancyBboxPatch((0.53, 0.08), 0.43, 0.76, boxstyle="round,pad=0.02,rounding_size=0.025", 
                               facecolor=LIGHT_GREEN, edgecolor='#34d399', linewidth=1.8)
    ax.add_patch(box_right)
    ax.text(0.745, 0.80, "SASYADRISHTI WORKFLOW (ALL-WEATHER & PROACTIVE)", ha='center', va='center', 
            fontsize=10.5, fontweight='bold', color=GREEN_SUCCESS)

    right_steps = [
        ("1. Sentinel-1 SAR Cloud Penetration", "C-Band microwave radar (5.6 cm) penetrates 100% of rain clouds.\nVH backscatter measures fresh biomass; VV maps flood boundaries.", '#d1fae5'),
        ("2. UAV Multispectral Drones (3.5 cm/px)", "Autonomous drone surveys delineate micro-bunds (Ali), plant\ndensity, and localized nitrogen stress with RedEdge 717nm.", '#d1fae5'),
        ("3. Digital Mobile CCE Ground-Truthing", "Krishi Sahayaks log fresh/dry cuts with auto-moisture formula;\nReal-time sync recalibrates hybrid AI ensemble within hours.", '#a7f3d0'),
        ("4. Tamper-Proof Digital Certificates", "Cryptographic SHA-256 tokens & QR codes issued to farmers;\nAccelerates FCI MSP quotas and fast-tracks PMFBY claims.", '#6ee7b7')
    ]
    for idx, (title, desc, bg) in enumerate(right_steps):
        y = 0.67 - idx * 0.17
        step_box = FancyBboxPatch((0.55, y - 0.05), 0.39, 0.13, boxstyle="round,pad=0.01,rounding_size=0.02",
                                  facecolor=bg, edgecolor='#10b981', linewidth=1)
        ax.add_patch(step_box)
        ax.text(0.57, y + 0.035, title, fontsize=8.8, fontweight='bold', color='#064e3b')
        ax.text(0.57, y - 0.015, desc, fontsize=7.4, color='#022c22', linespacing=1.2)

    path = os.path.join(out_dir, 'diagram_1_paradigm_shift.png')
    plt.savefig(path, bbox_inches='tight', facecolor=fig.get_facecolor(), edgecolor='none')
    plt.close()
    print(f"Generated: {path}")

# -----------------------------------------------------------------------------
# DIAGRAM 2: Monsoon SAR Radar Cloud Penetration Physics
# -----------------------------------------------------------------------------
def create_diagram_2():
    fig, ax = plt.subplots(figsize=(12, 6.2), dpi=220)
    fig.patch.set_facecolor(BG_COLOR)
    ax.set_facecolor(BG_COLOR)
    ax.axis('off')

    # Title
    ax.text(0.5, 0.95, "ALL-WEATHER REMOTE SENSING: SAR RADAR VS. OPTICAL SATELLITES", 
            ha='center', va='center', fontsize=13, fontweight='bold', color=DARK_BROWN)
    ax.text(0.5, 0.90, "Overcoming Assam's 80-Day Kharif Monsoon Cloud Cover via Dual-Polarization C-Band Radar", 
            ha='center', va='center', fontsize=9, color=WARM_AMBER)

    # Cloud Layer in the middle
    cloud_box = FancyBboxPatch((0.10, 0.52), 0.80, 0.20, boxstyle="round,pad=0.02,rounding_size=0.04", 
                              facecolor='#e2e8f0', edgecolor='#94a3b8', linewidth=1.5, linestyle='--')
    ax.add_patch(cloud_box)
    ax.text(0.5, 0.64, "THICK ASSAM MONSOON CLOUD & RAIN OBSTACLE (JUNE - OCTOBER)", ha='center', va='center',
            fontsize=10.5, fontweight='bold', color='#334155')
    ax.text(0.5, 0.58, "70% to 85% Cloud Cover • Optical Satellites (Sentinel-2, Landsat-8/9) Blind for 80+ Days", ha='center', va='center',
            fontsize=8.5, color='#475569')

    # Left: Optical Satellite Blocked
    ax.text(0.25, 0.82, "OPTICAL SENSORS (Sentinel-2 MSI)", ha='center', va='center', fontsize=10, fontweight='bold', color='#dc2626')
    ax.annotate("", xy=(0.25, 0.70), xytext=(0.25, 0.78), arrowprops=dict(arrowstyle="->", color='#dc2626', lw=2.5))
    ax.text(0.25, 0.44, "[ BLOCKED AT CLOUD TOP ]", ha='center', va='center', fontsize=9, fontweight='bold', color='#b91c1c')
    ax.text(0.25, 0.38, "No optical reflectance (NDVI/EVI)\ncan reach the ground surface", ha='center', va='center', fontsize=7.5, color='#7f1d1d')

    # Right: Microwave SAR Radar Penetrating
    ax.text(0.75, 0.82, "MICROWAVE C-BAND SAR (Sentinel-1)", ha='center', va='center', fontsize=10, fontweight='bold', color=BLUE_RADAR)
    ax.annotate("", xy=(0.75, 0.36), xytext=(0.75, 0.78), arrowprops=dict(arrowstyle="->", color=BLUE_RADAR, lw=3))
    ax.text(0.75, 0.44, "[ 100% CLOUD PENETRATION ]", ha='center', va='center', fontsize=9, fontweight='bold', color=GREEN_SUCCESS)
    ax.text(0.75, 0.38, "Microwaves (λ = 5.6 cm) penetrate\nheavy cumulus clouds, rain & haze", ha='center', va='center', fontsize=7.5, color='#065f46')

    # Ground Level Features (Bottom)
    ground_box = FancyBboxPatch((0.06, 0.08), 0.88, 0.22, boxstyle="round,pad=0.015,rounding_size=0.02",
                                facecolor='#f5efe6', edgecolor=WARM_AMBER, linewidth=1.5)
    ax.add_patch(ground_box)

    # Box 1: Rice Paddy Biomass
    paddy_box = FancyBboxPatch((0.09, 0.11), 0.38, 0.16, boxstyle="round,pad=0.01,rounding_size=0.015",
                               facecolor='#dcfce7', edgecolor='#16a34a', linewidth=1)
    ax.add_patch(paddy_box)
    ax.text(0.28, 0.22, "Rice Canopy: VH Cross-Polarization", ha='center', va='center', fontsize=8.5, fontweight='bold', color='#14532d')
    ax.text(0.28, 0.16, "Volume scattering from standing rice stalks.\nVH backscatter (dB) tracks fresh biomass & tillering.", ha='center', va='center', fontsize=7.2, color='#166534')

    # Box 2: Flood Inundation
    flood_box = FancyBboxPatch((0.53, 0.11), 0.38, 0.16, boxstyle="round,pad=0.01,rounding_size=0.015",
                               facecolor='#e0f2fe', edgecolor='#0284c7', linewidth=1)
    ax.add_patch(flood_box)
    ax.text(0.72, 0.22, "Flood Inundation: VV Co-Polarization", ha='center', va='center', fontsize=8.5, fontweight='bold', color='#075985')
    ax.text(0.72, 0.16, "Specular reflection away from sensor.\nSharp backscatter drop (≤ -16.5 dB) maps submerged crops.", ha='center', va='center', fontsize=7.2, color='#0369a1')

    path = os.path.join(out_dir, 'diagram_2_monsoon_sar_physics.png')
    plt.savefig(path, bbox_inches='tight', facecolor=fig.get_facecolor(), edgecolor='none')
    plt.close()
    print(f"Generated: {path}")

# -----------------------------------------------------------------------------
# DIAGRAM 3: Smallholder Multi-Tier Resolution Stack
# -----------------------------------------------------------------------------
def create_diagram_3():
    fig, ax = plt.subplots(figsize=(12, 6.2), dpi=220)
    fig.patch.set_facecolor(BG_COLOR)
    ax.set_facecolor(BG_COLOR)
    ax.axis('off')

    ax.text(0.5, 0.95, "SMALLHOLDER PARCEL RESOLUTION STACK: FROM SPACE TO DRONE", 
            ha='center', va='center', fontsize=13, fontweight='bold', color=DARK_BROWN)
    ax.text(0.5, 0.90, "Resolving Fragmented Assam Bigha-Katha-Lesa Parcels and Narrow Micro-Bunds", 
            ha='center', va='center', fontsize=9, color=WARM_AMBER)

    tiers = [
        ("TIER 1: COARSE SATELLITE (MODIS)", "250m - 1,000m Ground Pixel",
         "• Covers 150 to 500 Assam Bighas in one pixel\n• Extreme mixed-pixel errors along roads and bunds\n• Completely unusable for smallholder yield estimation\n• Obscures individual farmer holdings",
         '#fee2e2', '#ef4444', '#991b1b'),
        
        ("TIER 2: OPTICAL SATELLITE (Sentinel-2)", "10m Ground Sampling Distance",
         "• Covers ~0.75 Assam Bigha per pixel\n• Delineates village clusters & regional acreage\n• Captures multi-temporal NDVI / EVI curves\n• Struggles with narrow (<1m) field bunds (Ali)",
         '#fef3c7', '#d97706', '#92400e'),
        
        ("TIER 3: PRECISION UAV DRONE (MicaSense)", "3.5 cm / pixel Ultra-HD",
         "• Delineates micro-bunds & exact Dag boundaries\n• Measures plant emergence, lodging & weed stress\n• RedEdge (717nm) detects nitrogen deficit\n• Direct ground-truth validation for CCE cuts",
         '#d1fae5', '#10b981', '#065f46')
    ]

    for idx, (title, res, bullets, bg, border, title_col) in enumerate(tiers):
        x = 0.06 + idx * 0.31
        card = FancyBboxPatch((x, 0.12), 0.28, 0.72, boxstyle="round,pad=0.015,rounding_size=0.02",
                              facecolor=bg, edgecolor=border, linewidth=1.5)
        ax.add_patch(card)
        ax.text(x + 0.14, 0.78, title, ha='center', va='center', fontsize=8.8, fontweight='bold', color=title_col)
        ax.text(x + 0.14, 0.73, res, ha='center', va='center', fontsize=8, fontfamily='monospace', color=DARK_BROWN)
        
        # Divider line inside card
        ax.plot([x + 0.02, x + 0.26], [0.69, 0.69], color=border, lw=1)
        
        ax.text(x + 0.02, 0.50, bullets, ha='left', va='center', fontsize=7.5, color=TEXT_DARK, linespacing=1.6)

    path = os.path.join(out_dir, 'diagram_3_smallholder_resolution_stack.png')
    plt.savefig(path, bbox_inches='tight', facecolor=fig.get_facecolor(), edgecolor='none')
    plt.close()
    print(f"Generated: {path}")

# -----------------------------------------------------------------------------
# DIAGRAM 4: End-to-End Enterprise Architecture
# -----------------------------------------------------------------------------
def create_diagram_4():
    fig, ax = plt.subplots(figsize=(12, 6.8), dpi=220)
    fig.patch.set_facecolor(BG_COLOR)
    ax.set_facecolor(BG_COLOR)
    ax.axis('off')

    ax.text(0.5, 0.96, "SASYADRISHTI 4-TIER ENTERPRISE SYSTEM ARCHITECTURE", 
            ha='center', va='center', fontsize=13, fontweight='bold', color=DARK_BROWN)
    ax.text(0.5, 0.91, "Multi-Sensor Geospatial Data Ingestion, Hybrid AI Engine & Government Delivery Tier", 
            ha='center', va='center', fontsize=9, color=WARM_AMBER)

    tiers = [
        ("TIER 1: MULTI-SENSOR INGESTION GATEWAY", 
         "Copernicus Sentinel-1 (C-Band SAR GRD) • Sentinel-2 (MSI BOA Surface Refl) • ISRO Bhuvan Grids • UAV MicaSense 5-Band Orthomosaics • IMD Daily AWS Weather", 
         0.75, '#f5efe6', WARM_AMBER),
        
        ("TIER 2: PREPROCESSING & FEATURE EXTRACTION PIPELINE", 
         "SAR Radiometric Calibration & 7x7 Lee Speckle Filter • SCL Optical Cloud Masking • SRTM 30m Doppler Terrain Correction • Multi-temporal NDVI / NDRE / LAI Curves", 
         0.54, '#fef3c7', ACCENT_GOLD),
        
        ("TIER 3: HYBRID AI & BIOPHYSICAL CROP PREDICTION ENGINE", 
         "Stacking Ensemble: Regularized XGBoost (45%) + Random Forest (25%) + Bi-LSTM Deep Sequence (20%) + WOFOST Biophysical Crop Growth Model (10%)", 
         0.33, '#e0f2fe', BLUE_RADAR),
        
        ("TIER 4: APPLICATION, SECURITY & EDGE CLOUD DELIVERY", 
         "Cloudflare Pages Edge Network • Leaflet 1.9.4 WebGIS • Mobile CCE Logger • Farmer SHA-256 Certificate Generator • Dharitree ILRMS Cadastral Interop", 
         0.12, '#d1fae5', GREEN_SUCCESS)
    ]

    for title, desc, y, bg, border in tiers:
        box = FancyBboxPatch((0.08, y - 0.05), 0.84, 0.14, boxstyle="round,pad=0.015,rounding_size=0.02",
                             facecolor=bg, edgecolor=border, linewidth=1.8)
        ax.add_patch(box)
        ax.text(0.11, y + 0.05, title, fontsize=9.2, fontweight='bold', color=border)
        ax.text(0.11, y - 0.005, desc, fontsize=7.8, color=TEXT_DARK, linespacing=1.3)

        # Connector Arrows between tiers
        if y > 0.15:
            ax.annotate("", xy=(0.5, y - 0.05), xytext=(0.5, y - 0.09),
                        arrowprops=dict(arrowstyle="->", color=WARM_AMBER, lw=2))

    path = os.path.join(out_dir, 'diagram_4_enterprise_system_architecture.png')
    plt.savefig(path, bbox_inches='tight', facecolor=fig.get_facecolor(), edgecolor='none')
    plt.close()
    print(f"Generated: {path}")

# -----------------------------------------------------------------------------
# DIAGRAM 5: Digital CCE Moisture Normalization Loop
# -----------------------------------------------------------------------------
def create_diagram_5():
    fig, ax = plt.subplots(figsize=(12, 6.2), dpi=220)
    fig.patch.set_facecolor(BG_COLOR)
    ax.set_facecolor(BG_COLOR)
    ax.axis('off')

    ax.text(0.5, 0.95, "DIGITAL CROP CUTTING EXPERIMENT (CCE) MOISTURE STANDARDIZATION LOOP", 
            ha='center', va='center', fontsize=13, fontweight='bold', color=DARK_BROWN)
    ax.text(0.5, 0.90, "Ground-Truthing Field Calibration Workflow with 14% Storage Moisture Equilibrium", 
            ha='center', va='center', fontsize=9, color=WARM_AMBER)

    cce_boxes = [
        ("Step 1: 5m x 5m Field Cut", "ADO Krishi Sahayak marks quadrant in field.\nRecords fresh green weight using digital balance.", 0.08, 0.50, '#fef3c7', ACCENT_GOLD),
        ("Step 2: Moisture Meter Test", "Measures actual grain moisture (e.g. 18.2%)\nvia calibrated digital grain moisture probe.", 0.38, 0.50, '#fef3c7', ACCENT_GOLD),
        ("Step 3: Moisture Normalization", "Applies equilibrium formula to 14.0% benchmark:\nYield_std = Yield_raw * (100 - M_actual) / 86.0", 0.68, 0.50, '#d1fae5', GREEN_SUCCESS),
        ("Step 4: Real-Time Model Sync", "Normalized yield logged to central database;\nDynamically nudges AI regression coefficients.", 0.38, 0.15, '#e0f2fe', BLUE_RADAR)
    ]

    for title, desc, x, y, bg, border in cce_boxes:
        box = FancyBboxPatch((x, y - 0.06), 0.24, 0.17, boxstyle="round,pad=0.015,rounding_size=0.02",
                             facecolor=bg, edgecolor=border, linewidth=1.5)
        ax.add_patch(box)
        ax.text(x + 0.12, y + 0.065, title, ha='center', va='center', fontsize=8.5, fontweight='bold', color=border)
        ax.text(x + 0.12, y - 0.005, desc, ha='center', va='center', fontsize=7.2, color=TEXT_DARK, linespacing=1.2)

    # Connecting Flow Arrows
    ax.annotate("", xy=(0.37, 0.58), xytext=(0.33, 0.58), arrowprops=dict(arrowstyle="->", color=ACCENT_GOLD, lw=2))
    ax.annotate("", xy=(0.67, 0.58), xytext=(0.63, 0.58), arrowprops=dict(arrowstyle="->", color=GREEN_SUCCESS, lw=2))
    ax.annotate("", xy=(0.62, 0.23), xytext=(0.76, 0.43), arrowprops=dict(arrowstyle="->", color=BLUE_RADAR, lw=2))
    ax.annotate("", xy=(0.20, 0.43), xytext=(0.37, 0.23), arrowprops=dict(arrowstyle="->", color=WARM_AMBER, lw=2))

    path = os.path.join(out_dir, 'diagram_5_cce_moisture_normalization_loop.png')
    plt.savefig(path, bbox_inches='tight', facecolor=fig.get_facecolor(), edgecolor='none')
    plt.close()
    print(f"Generated: {path}")

# -----------------------------------------------------------------------------
# DIAGRAM 6: 12-Month Gantt Roadmap & Milestones
# -----------------------------------------------------------------------------
def create_diagram_6():
    fig, ax = plt.subplots(figsize=(12, 6.2), dpi=220)
    fig.patch.set_facecolor(BG_COLOR)
    ax.set_facecolor(BG_COLOR)
    ax.axis('off')

    ax.text(0.5, 0.95, "12-MONTH DEVELOPMENT ROADMAP & AGRICULTURAL MILESTONES", 
            ha='center', va='center', fontsize=13, fontweight='bold', color=DARK_BROWN)
    ax.text(0.5, 0.90, "Aligned with Assam's Kharif Sali Paddy & Rabi Mustard Cropping Seasons", 
            ha='center', va='center', fontsize=9, color=WARM_AMBER)

    phases = [
        ("Phase 1: Discovery & STAC Pipelines", 1, 2, "SRS, Cadastral Data Dictionary & Ingestion Pipelines", '#f5efe6', WARM_AMBER),
        ("Phase 2: SAR Ingestion & Baseline AI", 3, 4, "SAR Doppler Calibration, Speckle Filters & Baseline Model", '#fef3c7', ACCENT_GOLD),
        ("Phase 3: WebGIS & Mobile CCE MVP", 5, 6, "MVP Launch on Cloudflare Edge with Mobile CCE App", '#e0f2fe', BLUE_RADAR),
        ("Phase 4: Kharif Sali Field Pilot", 7, 9, "300 Mobile CCE Cuts + 20 Drone Flights (Kamrup & Nagaon)", '#d1fae5', GREEN_SUCCESS),
        ("Phase 5: State-Wide Rollout & UAT", 10, 12, "CERT-In Audit, 35 District Scale & Department Handoff", '#ede9fe', '#7c3aed')
    ]

    # Draw timeline axis (Months 1 to 12)
    start_x = 0.28
    width_month = 0.055
    y_axis = 0.77

    for m in range(1, 13):
        xm = start_x + (m - 1) * width_month
        ax.text(xm + width_month / 2, y_axis + 0.03, f"M{m}", ha='center', va='center', fontsize=8, fontweight='bold', color=DARK_BROWN)
        ax.plot([xm, xm], [0.12, y_axis], color='#e7e5e4', lw=0.8, linestyle=':')

    for idx, (title, sm, em, deliverable, bg, border) in enumerate(phases):
        y = 0.65 - idx * 0.11
        # Title on the left
        ax.text(0.04, y + 0.02, title, fontsize=8.2, fontweight='bold', color=border)
        ax.text(0.04, y - 0.02, deliverable, fontsize=6.8, color=TEXT_MUTED)

        # Bar
        bx = start_x + (sm - 1) * width_month
        bw = (em - sm + 1) * width_month - 0.005
        bar = FancyBboxPatch((bx, y - 0.03), bw, 0.06, boxstyle="round,pad=0.005,rounding_size=0.01",
                             facecolor=bg, edgecolor=border, linewidth=1.5)
        ax.add_patch(bar)

    path = os.path.join(out_dir, 'diagram_6_indicative_gantt_roadmap.png')
    plt.savefig(path, bbox_inches='tight', facecolor=fig.get_facecolor(), edgecolor='none')
    plt.close()
    print(f"Generated: {path}")

# -----------------------------------------------------------------------------
# DIAGRAM 7: Tamper-Evident Digital Yield Certificate Flow
# -----------------------------------------------------------------------------
def create_diagram_7():
    fig, ax = plt.subplots(figsize=(12, 6.2), dpi=220)
    fig.patch.set_facecolor(BG_COLOR)
    ax.set_facecolor(BG_COLOR)
    ax.axis('off')

    ax.text(0.5, 0.95, "TAMPER-PROOF DIGITAL CROP YIELD CERTIFICATE & TRUST ARCHITECTURE", 
            ha='center', va='center', fontsize=13, fontweight='bold', color=DARK_BROWN)
    ax.text(0.5, 0.90, "End-to-End Evidentiary Data Integrity for MSP Procurement Quotas & PMFBY Crop Insurance", 
            ha='center', va='center', fontsize=9, color=WARM_AMBER)

    steps = [
        ("1. Input Parameters", "• Dag & Patta #\n• Farmer PM-KISAN ID\n• Assam BKL Area\n• Multi-Sensor Data", 0.08, '#f5efe6', WARM_AMBER),
        ("2. Calibrated Yield", "• Hybrid ML Inference\n• WOFOST Constraints\n• Moisture Normalized\n• Confidence: 94.2%", 0.31, '#fef3c7', ACCENT_GOLD),
        ("3. SHA-256 Hashing", "• Immutable Digest\n• Digitally Signed\n• Appended to Ledger\n• Non-repudiable Token", 0.54, '#d1fae5', GREEN_SUCCESS),
        ("4. Consumer Verify", "• FCI / AFCSCL MSP\n• PMFBY Claim Settlement\n• Bank KCC Validation\n• Mobile QR Scanning", 0.77, '#e0f2fe', BLUE_RADAR)
    ]

    for title, bullets, x, bg, border in steps:
        box = FancyBboxPatch((x, 0.25), 0.18, 0.48, boxstyle="round,pad=0.015,rounding_size=0.02",
                             facecolor=bg, edgecolor=border, linewidth=1.5)
        ax.add_patch(box)
        ax.text(x + 0.09, 0.68, title, ha='center', va='center', fontsize=9, fontweight='bold', color=border)
        ax.plot([x + 0.015, x + 0.165], [0.63, 0.63], color=border, lw=1)
        ax.text(x + 0.02, 0.44, bullets, ha='left', va='center', fontsize=7.5, color=TEXT_DARK, linespacing=1.6)

        if x < 0.70:
            ax.annotate("", xy=(x + 0.22, 0.48), xytext=(x + 0.19, 0.48),
                        arrowprops=dict(arrowstyle="->", color=DARK_BROWN, lw=2))

    path = os.path.join(out_dir, 'diagram_7_verifiable_certificate_flow.png')
    plt.savefig(path, bbox_inches='tight', facecolor=fig.get_facecolor(), edgecolor='none')
    plt.close()
    print(f"Generated: {path}")

if __name__ == '__main__':
    print("Generating official proposal diagrams for NESFIC-D-12...")
    create_diagram_1()
    create_diagram_2()
    create_diagram_3()
    create_diagram_4()
    create_diagram_5()
    create_diagram_6()
    create_diagram_7()
    print("All 7 proposal diagrams successfully generated in assets/proposal_diagrams!")

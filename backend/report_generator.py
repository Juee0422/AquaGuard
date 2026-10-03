import io
import csv
from datetime import datetime
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from models import ReservoirHealthResponse

def generate_pdf_report(data: ReservoirHealthResponse) -> bytes:
    """Generates an executive PDF report for environmental agencies and treatment plant operators."""
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(
        buffer,
        pagesize=letter,
        rightMargin=40,
        leftMargin=40,
        topMargin=40,
        bottomMargin=40
    )

    styles = getSampleStyleSheet()
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=20,
        leading=24,
        textColor=colors.HexColor('#0B132B')
    )
    subtitle_style = ParagraphStyle(
        'DocSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=10,
        leading=14,
        textColor=colors.HexColor('#4B5563')
    )
    section_heading = ParagraphStyle(
        'SectionHeading',
        parent=styles['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=13,
        leading=16,
        textColor=colors.HexColor('#1C2541'),
        spaceBefore=10,
        spaceAfter=6
    )
    body_style = ParagraphStyle(
        'BodyDark',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=13,
        textColor=colors.HexColor('#1F2937')
    )
    table_cell = ParagraphStyle(
        'TableCell',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.5,
        leading=11
    )

    story = []

    # Header
    story.append(Paragraph("AquaGuard AI: Satellite Water Quality & HAB Early Warning", title_style))
    story.append(Paragraph(
        f"Official Earth Observation & Bio-Optical Assessment Report | Generated: {datetime.now().strftime('%Y-%m-%d %H:%M UTC')}",
        subtitle_style
    ))
    story.append(Spacer(1, 10))
    story.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor('#10B981'), spaceAfter=15))

    # Alert Banner Box
    alert_color = (
        colors.HexColor('#EF4444') if data.metrics.alert_level == "CRITICAL"
        else (colors.HexColor('#F59E0B') if data.metrics.alert_level == "MODERATE" else colors.HexColor('#10B981'))
    )
    alert_text = f"<b>STATUS: {data.metrics.alert_level} RISK</b> | HAB Threat Index: <b>{data.metrics.bloom_risk_score} / 100</b> | Algae Bloom Coverage: <b>{data.metrics.bloom_coverage_percent}%</b>"
    
    alert_table = Table([[Paragraph(alert_text, ParagraphStyle('AlertText', textColor=colors.white, fontName='Helvetica-Bold', fontSize=10, alignment=1))]], colWidths=[530])
    alert_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), alert_color),
        ('TOPPADDING', (0, 0), (-1, -1), 7),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 7),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
    ]))
    story.append(alert_table)
    story.append(Spacer(1, 12))

    # Reservoir Metadata Table
    story.append(Paragraph("1. Target Reservoir & Remote Sensing Telemetry", section_heading))
    res_data = [
        [Paragraph("<b>Target Facility:</b>", body_style), Paragraph(f"{data.reservoir.name} ({data.reservoir.district}, {data.reservoir.state})", body_style),
         Paragraph("<b>Supply Capacity:</b>", body_style), Paragraph(f"{data.reservoir.capacity_mld} MLD", body_style)],
        [Paragraph("<b>Coordinates:</b>", body_style), Paragraph(f"{data.reservoir.lat}° N, {data.reservoir.lng}° E", body_style),
         Paragraph("<b>Surface Area:</b>", body_style), Paragraph(f"{data.reservoir.surface_area_sqkm} km²", body_style)],
        [Paragraph("<b>Satellite Platform:</b>", body_style), Paragraph(data.satellite_source, body_style),
         Paragraph("<b>Cloud Cover:</b>", body_style), Paragraph(f"{data.cloud_cover_percent}%", body_style)],
        [Paragraph("<b>Primary Supply To:</b>", body_style), Paragraph(data.reservoir.key_water_supply_for, body_style),
         Paragraph("<b>Processing Mode:</b>", body_style), Paragraph("Simulated Stress Run" if data.is_simulated else "Copernicus L2A Live", body_style)]
    ]
    t_res = Table(res_data, colWidths=[110, 160, 110, 150])
    t_res.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor('#F8FAFC')),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#E2E8F0')),
        ('TOPPADDING', (0, 0), (-1, -1), 5),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
    ]))
    story.append(t_res)
    story.append(Spacer(1, 12))

    # Spectral Indices & Biophysical Metrics
    story.append(Paragraph("2. Sentinel-2 Spectral Indices & Water Quality Metrics", section_heading))
    metrics_data = [
        ["Parameter", "Observed Value", "Normal Drinking Threshold", "Status / Interpretation"],
        ["Floating Algae Index (FAI)", f"{data.indices.fai:.4f}", "< 0.0150", "Elevated surface bloom" if data.indices.fai > 0.015 else "Optimal clear baseline"],
        ["Chlorophyll-a (µg/L)", f"{data.metrics.chlorophyll_a_ug_l:.1f} µg/L", "< 10.0 µg/L", "High algal density" if data.metrics.chlorophyll_a_ug_l > 15 else "Normal mesotrophic"],
        ["Turbidity (FNU)", f"{data.metrics.turbidity_fnu:.1f} FNU", "< 5.0 FNU", "Elevated suspended particulates" if data.metrics.turbidity_fnu > 5 else "Compliant clear water"],
        ["Normalized Difference Water (NDWI)", f"{data.indices.ndwi:.4f}", "> 0.3000", "Clean water delineation"],
        ["Vegetation Index (NDVI)", f"{data.indices.ndvi:.4f}", "< 0.1500", "High surface vegetative mat" if data.indices.ndvi > 0.2 else "Low aquatic vegetative interference"],
        ["Turbidity Index (NDTI)", f"{data.indices.ndti:.4f}", "< 0.0500", "Sediment / organic turbidity proxy"],
        ["Secchi Disk Clarity", f"{data.metrics.water_clarity_secchi_m:.2f} m", "> 2.00 m", "Acceptable transparency" if data.metrics.water_clarity_secchi_m >= 2.0 else "Reduced photic penetration"],
        ["Dissolved Oxygen", f"{data.metrics.dissolved_oxygen_mg_l:.1f} mg/L", "> 5.0 mg/L", "Adequate oxygenation" if data.metrics.dissolved_oxygen_mg_l >= 5.0 else "Risk of hypolimnetic anoxia"],
        ["Surface Temperature", f"{data.metrics.surface_temperature_c:.1f} °C", "22.0 - 26.0 °C", "Thermal bloom catalyst" if data.metrics.surface_temperature_c > 26.5 else "Seasonal standard"]
    ]
    t_metrics = Table(metrics_data, colWidths=[160, 95, 125, 150])
    t_metrics.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#0B132B')),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, -1), 8),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#F8FAFC')]),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#E2E8F0')),
        ('TOPPADDING', (0, 0), (-1, -1), 4),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
    ]))
    story.append(t_metrics)
    story.append(Spacer(1, 12))

    # Mitigation Checklist
    story.append(Paragraph("3. Operational Treatment & Mitigation Actions", section_heading))
    actions_data = [["Urgency", "Category", "Operational Directive", "Target Parameter & Dosage"]]
    for act in data.mitigation_actions:
        actions_data.append([
            act.urgency,
            act.category,
            Paragraph(f"<b>{act.title}</b><br/>{act.action_item}", table_cell),
            Paragraph(f"<b>{act.target_parameter}</b><br/>{act.recommended_dosage or 'N/A'}", table_cell)
        ])
    
    t_actions = Table(actions_data, colWidths=[65, 80, 240, 145])
    t_actions.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#1C2541')),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, -1), 8),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#F8FAFC')]),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#E2E8F0')),
        ('TOPPADDING', (0, 0), (-1, -1), 5),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
    ]))
    story.append(t_actions)
    story.append(Spacer(1, 15))

    # Footer Disclaimer
    story.append(Paragraph(
        "<i>Notice: Generated automatically by AquaGuard AI Satellite Intelligence Pipeline using ESA Copernicus Sentinel-2 MSI data. "
        "Intended for municipal water works operators, irrigation boards, and environmental protection agencies.</i>",
        subtitle_style
    ))

    doc.build(story)
    return buffer.getvalue()

def generate_csv_report(data: ReservoirHealthResponse) -> str:
    """Generates a CSV string representation of the current observation."""
    output = io.StringIO()
    writer = csv.writer(output)
    
    writer.writerow(["AquaGuard AI Water Quality Report"])
    writer.writerow(["Timestamp", data.timestamp])
    writer.writerow(["Reservoir ID", data.reservoir.id])
    writer.writerow(["Reservoir Name", data.reservoir.name])
    writer.writerow(["District", data.reservoir.district])
    writer.writerow(["State", data.reservoir.state])
    writer.writerow(["Latitude", data.reservoir.lat])
    writer.writerow(["Longitude", data.reservoir.lng])
    writer.writerow(["Capacity (MLD)", data.reservoir.capacity_mld])
    writer.writerow(["Satellite Platform", data.satellite_source])
    writer.writerow(["Cloud Cover (%)", data.cloud_cover_percent])
    writer.writerow([])
    writer.writerow(["Spectral Indices"])
    writer.writerow(["NDWI", data.indices.ndwi])
    writer.writerow(["FAI", data.indices.fai])
    writer.writerow(["NDVI", data.indices.ndvi])
    writer.writerow(["NDTI", data.indices.ndti])
    writer.writerow([])
    writer.writerow(["Biophysical Metrics"])
    writer.writerow(["Chlorophyll-a (ug/L)", data.metrics.chlorophyll_a_ug_l])
    writer.writerow(["Turbidity (FNU)", data.metrics.turbidity_fnu])
    writer.writerow(["Surface Temperature (C)", data.metrics.surface_temperature_c])
    writer.writerow(["Secchi Clarity (m)", data.metrics.water_clarity_secchi_m])
    writer.writerow(["Dissolved Oxygen (mg/L)", data.metrics.dissolved_oxygen_mg_l])
    writer.writerow(["Bloom Coverage (%)", data.metrics.bloom_coverage_percent])
    writer.writerow(["Bloom Risk Score (0-100)", data.metrics.bloom_risk_score])
    writer.writerow(["Alert Level", data.metrics.alert_level])
    writer.writerow(["Primary Ecological Driver", data.metrics.primary_driver])
    writer.writerow([])
    writer.writerow(["Mitigation Actions"])
    writer.writerow(["Urgency", "Category", "Title", "Action Item", "Recommended Dosage"])
    for act in data.mitigation_actions:
        writer.writerow([act.urgency, act.category, act.title, act.action_item, act.recommended_dosage])
    
    return output.getvalue()

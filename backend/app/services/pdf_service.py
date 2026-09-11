from reportlab.lib import colors
from reportlab.lib.pagesizes import letter, A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, Image, PageBreak
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from typing import Dict, Any, Optional
from app.config import settings
from app.logging import logger
import os
from datetime import datetime


class PDFService:
    """Service for generating PDF itineraries."""
    
    def __init__(self):
        self.output_dir = settings.PDF_OUTPUT_DIR
        os.makedirs(self.output_dir, exist_ok=True)
    
    async def generate_itinerary_pdf(
        self,
        trip_data: Dict[str, Any],
        trip_plan: Dict[str, Any],
    ) -> Optional[str]:
        """Generate a PDF itinerary for a trip."""
        try:
            filename = f"itinerary_{trip_data['id']}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.pdf"
            filepath = os.path.join(self.output_dir, filename)
            
            doc = SimpleDocTemplate(
                filepath,
                pagesize=A4,
                rightMargin=72,
                leftMargin=72,
                topMargin=72,
                bottomMargin=18,
            )
            
            story = []
            styles = getSampleStyleSheet()
            
            # Custom styles
            title_style = ParagraphStyle(
                "CustomTitle",
                parent=styles["Heading1"],
                fontSize=24,
                textColor=colors.HexColor("#1e40af"),
                spaceAfter=30,
                alignment=TA_CENTER,
            )
            
            heading_style = ParagraphStyle(
                "CustomHeading",
                parent=styles["Heading2"],
                fontSize=16,
                textColor=colors.HexColor("#1e40af"),
                spaceAfter=12,
            )
            
            # Title
            story.append(Paragraph(f"VoyageAI - Travel Itinerary", title_style))
            story.append(Spacer(1, 0.2 * inch))
            
            # Trip Overview
            story.append(Paragraph("Trip Overview", heading_style))
            overview_data = [
                ["Destination:", trip_data.get("destination", "N/A")],
                ["Origin:", trip_data.get("origin", "N/A")],
                ["Start Date:", str(trip_data.get("start_date", "N/A"))],
                ["End Date:", str(trip_data.get("end_date", "N/A"))],
                ["Travelers:", str(trip_data.get("travelers", "N/A"))],
                ["Budget:", f"{trip_data.get('budget', 0)} {trip_data.get('currency', 'USD')}"],
            ]
            
            overview_table = Table(overview_data, colWidths=[2 * inch, 4 * inch])
            overview_table.setStyle(TableStyle([
                ("BACKGROUND", (0, 0), (0, -1), colors.HexColor("#e0e7ff")),
                ("TEXTCOLOR", (0, 0), (0, -1), colors.black),
                ("ALIGN", (0, 0), (-1, -1), "LEFT"),
                ("FONTNAME", (0, 0), (-1, -1), "Helvetica"),
                ("FONTSIZE", (0, 0), (-1, -1), 10),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 12),
                ("BACKGROUND", (1, 0), (1, -1), colors.beige),
                ("GRID", (0, 0), (-1, -1), 1, colors.black),
            ]))
            story.append(overview_table)
            story.append(Spacer(1, 0.3 * inch))
            
            # Weather Information
            if trip_plan.get("weather"):
                story.append(Paragraph("Weather Information", heading_style))
                weather = trip_plan["weather"]
                weather_text = f"""
                Current Temperature: {weather.get('current', {}).get('temp', 'N/A')}°C
                Conditions: {weather.get('current', {}).get('weather_description', 'N/A')}
                Best Time to Visit: {weather.get('best_time_to_visit', 'N/A')}
                """
                story.append(Paragraph(weather_text, styles["Normal"]))
                story.append(Spacer(1, 0.2 * inch))
            
            # Day-wise Itinerary
            if trip_plan.get("itinerary") and trip_plan["itinerary"].get("days"):
                story.append(PageBreak())
                story.append(Paragraph("Day-wise Itinerary", heading_style))
                
                for day in trip_plan["itinerary"]["days"]:
                    story.append(Paragraph(f"Day {day.get('day', 1)} - {day.get('title', '')}", styles["Heading3"]))
                    story.append(Paragraph(f"Date: {day.get('date', 'N/A')}", styles["Normal"]))
                    story.append(Paragraph(day.get("description", ""), styles["Normal"]))
                    story.append(Spacer(1, 0.1 * inch))
                    
                    # Activities
                    if day.get("activities"):
                        story.append(Paragraph("Activities:", styles["Heading4"]))
                        for activity in day["activities"]:
                            activity_text = f"{activity.get('time', '')} - {activity.get('activity', '')} ({activity.get('duration', '')})"
                            story.append(Paragraph(activity_text, styles["Normal"]))
                    
                    # Meals
                    if day.get("meals"):
                        story.append(Spacer(1, 0.1 * inch))
                        story.append(Paragraph("Meals:", styles["Heading4"]))
                        for meal in day["meals"]:
                            meal_text = f"{meal.get('type', '')}: {meal.get('restaurant', '')} - {meal.get('cuisine', '')}"
                            story.append(Paragraph(meal_text, styles["Normal"]))
                    
                    # Tips
                    if day.get("tips"):
                        story.append(Spacer(1, 0.1 * inch))
                        story.append(Paragraph("Tips:", styles["Heading4"]))
                        for tip in day["tips"]:
                            story.append(Paragraph(f"• {tip}", styles["Normal"]))
                    
                    story.append(Spacer(1, 0.2 * inch))
            
            # Budget Breakdown
            if trip_plan.get("budget_breakdown"):
                story.append(PageBreak())
                story.append(Paragraph("Budget Breakdown", heading_style))
                
                budget = trip_plan["budget_breakdown"]
                budget_data = [
                    ["Total Budget", f"{budget.get('total_budget', 0)} {budget.get('currency', 'USD')}"],
                    ["Flights", f"{budget.get('flights', 0)}"],
                    ["Accommodation", f"{budget.get('accommodation', 0)}"],
                    ["Food", f"{budget.get('food', 0)}"],
                    ["Activities", f"{budget.get('activities', 0)}"],
                    ["Transport", f"{budget.get('transport', 0)}"],
                    ["Emergency Buffer", f"{budget.get('emergency_buffer', 0)}"],
                ]
                
                budget_table = Table(budget_data, colWidths=[3 * inch, 2 * inch])
                budget_table.setStyle(TableStyle([
                    ("BACKGROUND", (0, 0), (0, -1), colors.HexColor("#e0e7ff")),
                    ("TEXTCOLOR", (0, 0), (-1, -1), colors.black),
                    ("ALIGN", (0, 0), (-1, -1), "LEFT"),
                    ("FONTNAME", (0, 0), (-1, -1), "Helvetica"),
                    ("FONTSIZE", (0, 0), (-1, -1), 10),
                    ("BOTTOMPADDING", (0, 0), (-1, -1), 12),
                    ("BACKGROUND", (1, 0), (1, -1), colors.beige),
                    ("GRID", (0, 0), (-1, -1), 1, colors.black),
                ]))
                story.append(budget_table)
            
            # Travel Tips
            if trip_plan.get("itinerary") and trip_plan["itinerary"].get("travel_tips"):
                story.append(Spacer(1, 0.3 * inch))
                story.append(Paragraph("Travel Tips", heading_style))
                for tip in trip_plan["itinerary"]["travel_tips"]:
                    story.append(Paragraph(f"• {tip}", styles["Normal"]))
            
            # Packing Suggestions
            if trip_plan.get("itinerary") and trip_plan["itinerary"].get("packing_suggestions"):
                story.append(Spacer(1, 0.3 * inch))
                story.append(Paragraph("Packing Suggestions", heading_style))
                for item in trip_plan["itinerary"]["packing_suggestions"]:
                    story.append(Paragraph(f"• {item}", styles["Normal"]))
            
            # Footer
            story.append(Spacer(1, 0.5 * inch))
            story.append(Paragraph("Generated by VoyageAI - Your AI Travel Assistant", styles["Normal"]))
            
            # Build PDF
            doc.build(story)
            
            logger.info(f"PDF generated successfully: {filepath}")
            return filepath
            
        except Exception as e:
            logger.error(f"Error generating PDF: {str(e)}")
            return None

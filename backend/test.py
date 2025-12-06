import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import openpyxl
from openpyxl.styles import PatternFill, Font, Alignment, Border, Side
from openpyxl.utils import get_column_letter
import matplotlib.pyplot as plt
from io import BytesIO

def generate_collision_analysis_excel():
    """
    Generate Excel file with collision probability analysis like sample data
    """
    # Create a more realistic dataset with multiple vehicles
    np.random.seed(42)
    
    # Generate timestamps
    timestamps = list(range(0, 100))  # 100 timesteps
    
    # Create data for 3 vehicles
    data = []
    
    # Vehicle 1: Moving steadily (low collision risk)
    for t in timestamps:
        if t < 20:
            data.append({
                'timestamp': t,
                'vehicle_id': 1,
                'position_x': 10.5 + t * 1.2,
                'position_y': 20.3 + t * 0.8,
                'velocity_x': 1.2,
                'velocity_y': 0.8,
                'acceleration_x': 0.0,
                'acceleration_y': 0.0
            })
        else:
            # After t=20, vehicle continues
            data.append({
                'timestamp': t,
                'vehicle_id': 1,
                'position_x': 10.5 + t * 1.2 + np.random.normal(0, 0.1),
                'position_y': 20.3 + t * 0.8 + np.random.normal(0, 0.1),
                'velocity_x': 1.2 + np.random.normal(0, 0.05),
                'velocity_y': 0.8 + np.random.normal(0, 0.05),
                'acceleration_x': np.random.normal(0, 0.01),
                'acceleration_y': np.random.normal(0, 0.01)
            })
    
    # Vehicle 2: Erratic movement (high collision risk)
    for t in timestamps:
        base_x = 50 + t * 0.5
        base_y = 30 + t * 0.3
        
        if 30 <= t <= 50:  # Dangerous period
            data.append({
                'timestamp': t,
                'vehicle_id': 2,
                'position_x': base_x + np.random.normal(0, 2.0),  # High variance
                'position_y': base_y + np.random.normal(0, 1.5),
                'velocity_x': 0.5 + np.random.normal(0, 0.3),  # Erratic speed
                'velocity_y': 0.3 + np.random.normal(0, 0.2),
                'acceleration_x': np.random.normal(0, 0.1),
                'acceleration_y': np.random.normal(0, 0.1)
            })
        else:
            data.append({
                'timestamp': t,
                'vehicle_id': 2,
                'position_x': base_x + np.random.normal(0, 0.5),
                'position_y': base_y + np.random.normal(0, 0.3),
                'velocity_x': 0.5 + np.random.normal(0, 0.1),
                'velocity_y': 0.3 + np.random.normal(0, 0.05),
                'acceleration_x': np.random.normal(0, 0.02),
                'acceleration_y': np.random.normal(0, 0.02)
            })
    
    # Vehicle 3: Sudden braking scenario
    for t in timestamps:
        if t < 40:
            data.append({
                'timestamp': t,
                'vehicle_id': 3,
                'position_x': 5 + t * 2.0,
                'position_y': 40 + t * 1.0,
                'velocity_x': 2.0,
                'velocity_y': 1.0,
                'acceleration_x': 0.0,
                'acceleration_y': 0.0
            })
        elif 40 <= t <= 60:  # Sudden braking
            decel_factor = (60 - t) / 20  # Goes from 1 to 0
            data.append({
                'timestamp': t,
                'vehicle_id': 3,
                'position_x': 5 + 40*2.0 + (t-40)*(2.0*decel_factor),
                'position_y': 40 + 40*1.0 + (t-40)*(1.0*decel_factor),
                'velocity_x': 2.0 * decel_factor,
                'velocity_y': 1.0 * decel_factor,
                'acceleration_x': -0.1,
                'acceleration_y': -0.05
            })
        else:
            data.append({
                'timestamp': t,
                'vehicle_id': 3,
                'position_x': 5 + 40*2.0 + 20*1.0 + (t-60)*0.5,
                'position_y': 40 + 40*1.0 + 20*0.5 + (t-60)*0.25,
                'velocity_x': 0.5,
                'velocity_y': 0.25,
                'acceleration_x': 0.0,
                'acceleration_y': 0.0
            })
    
    # Create DataFrame
    df = pd.DataFrame(data)
    
    # Calculate collision probability metrics
    df['speed'] = np.sqrt(df['velocity_x']**2 + df['velocity_y']**2)
    df['speed_change'] = df.groupby('vehicle_id')['speed'].diff().abs()
    df['acceleration_magnitude'] = np.sqrt(df['acceleration_x']**2 + df['acceleration_y']**2)
    
    # Calculate distance between vehicles (simplified)
    collision_risk = []
    for idx, row in df.iterrows():
        vehicle_id = row['vehicle_id']
        timestamp = row['timestamp']
        
        # Get other vehicles at same timestamp
        other_vehicles = df[(df['timestamp'] == timestamp) & (df['vehicle_id'] != vehicle_id)]
        
        if len(other_vehicles) > 0:
            min_distance = float('inf')
            for _, other in other_vehicles.iterrows():
                distance = np.sqrt((row['position_x'] - other['position_x'])**2 + 
                                 (row['position_y'] - other['position_y'])**2)
                min_distance = min(min_distance, distance)
            
            # Collision probability based on distance and speed
            if min_distance < 5:  # Very close
                risk = 0.9 + np.random.random() * 0.1
            elif min_distance < 10:  # Close
                risk = 0.6 + np.random.random() * 0.3
            elif min_distance < 20:  # Moderate
                risk = 0.3 + np.random.random() * 0.3
            else:
                risk = 0.0 + np.random.random() * 0.2
            
            # Adjust based on speed and acceleration
            if row['speed'] > 3:
                risk *= 1.2
            if row['acceleration_magnitude'] > 0.5:
                risk *= 1.3
            
            risk = min(1.0, max(0.0, risk))
        else:
            risk = 0.0
        
        collision_risk.append(risk)
    
    df['collision_probability'] = collision_risk
    
    # Add collision alert
    df['collision_alert'] = df['collision_probability'].apply(
        lambda x: 'HIGH' if x > 0.7 else 'MEDIUM' if x > 0.4 else 'LOW'
    )
    
    # Create Excel writer
    output_file = 'collision_risk_analysis.xlsx'
    with pd.ExcelWriter(output_file, engine='openpyxl') as writer:
        # Sheet 1: Raw Data
        df.to_excel(writer, sheet_name='Raw_Data', index=False)
        
        # Sheet 2: Summary Statistics
        summary_data = []
        for vehicle_id in df['vehicle_id'].unique():
            vehicle_df = df[df['vehicle_id'] == vehicle_id]
            summary_data.append({
                'Vehicle_ID': vehicle_id,
                'Data_Points': len(vehicle_df),
                'Avg_Speed': vehicle_df['speed'].mean(),
                'Max_Speed': vehicle_df['speed'].max(),
                'Avg_Collision_Probability': vehicle_df['collision_probability'].mean(),
                'Max_Collision_Probability': vehicle_df['collision_probability'].max(),
                'High_Risk_Points': len(vehicle_df[vehicle_df['collision_alert'] == 'HIGH']),
                'Medium_Risk_Points': len(vehicle_df[vehicle_df['collision_alert'] == 'MEDIUM']),
                'Low_Risk_Points': len(vehicle_df[vehicle_df['collision_alert'] == 'LOW'])
            })
        
        summary_df = pd.DataFrame(summary_data)
        summary_df.to_excel(writer, sheet_name='Summary_Statistics', index=False)
        
        # Sheet 3: High Risk Events
        high_risk_df = df[df['collision_alert'] == 'HIGH'].copy()
        high_risk_df = high_risk_df.sort_values(['timestamp', 'collision_probability'], ascending=[True, False])
        high_risk_df.to_excel(writer, sheet_name='High_Risk_Events', index=False)
        
        # Sheet 4: Time-based Analysis
        time_analysis = []
        for t in sorted(df['timestamp'].unique()):
            time_df = df[df['timestamp'] == t]
            time_analysis.append({
                'Timestamp': t,
                'Vehicles_Count': len(time_df),
                'Avg_Collision_Probability': time_df['collision_probability'].mean(),
                'Max_Collision_Probability': time_df['collision_probability'].max(),
                'High_Risk_Vehicles': len(time_df[time_df['collision_alert'] == 'HIGH']),
                'Total_Speed': time_df['speed'].sum(),
                'Danger_Score': len(time_df[time_df['collision_alert'] == 'HIGH']) * 3 + 
                              len(time_df[time_df['collision_alert'] == 'MEDIUM']) * 1
            })
        
        time_df = pd.DataFrame(time_analysis)
        time_df.to_excel(writer, sheet_name='Time_Analysis', index=False)
        
        # Sheet 5: Vehicle Trajectories
        trajectory_data = []
        for vehicle_id in df['vehicle_id'].unique():
            vehicle_df = df[df['vehicle_id'] == vehicle_id].sort_values('timestamp')
            trajectory_data.append({
                'Vehicle_ID': vehicle_id,
                'Start_X': vehicle_df['position_x'].iloc[0],
                'Start_Y': vehicle_df['position_y'].iloc[0],
                'End_X': vehicle_df['position_x'].iloc[-1],
                'End_Y': vehicle_df['position_y'].iloc[-1],
                'Total_Distance': np.sum(np.sqrt(
                    vehicle_df['position_x'].diff()**2 + 
                    vehicle_df['position_y'].diff()**2
                ).fillna(0)),
                'Avg_Collision_Risk': vehicle_df['collision_probability'].mean(),
                'Risk_Peak_Time': vehicle_df.loc[vehicle_df['collision_probability'].idxmax(), 'timestamp'],
                'Max_Risk': vehicle_df['collision_probability'].max()
            })
        
        trajectory_df = pd.DataFrame(trajectory_data)
        trajectory_df.to_excel(writer, sheet_name='Trajectory_Analysis', index=False)
    
    # Apply formatting to Excel file
    apply_excel_formatting(output_file)
    
    print(f"Excel file generated: {output_file}")
    print(f"Total records: {len(df)}")
    print(f"Vehicles analyzed: {df['vehicle_id'].nunique()}")
    print(f"High risk events: {len(high_risk_df)}")
    
    return output_file, df

def apply_excel_formatting(filename):
    """
    Apply professional formatting to the Excel file
    """
    from openpyxl import load_workbook
    
    wb = load_workbook(filename)
    
    # Define styles
    header_fill = PatternFill(start_color='366092', end_color='366092', fill_type='solid')
    header_font = Font(color='FFFFFF', bold=True)
    center_alignment = Alignment(horizontal='center', vertical='center')
    border = Border(
        left=Side(style='thin'),
        right=Side(style='thin'),
        top=Side(style='thin'),
        bottom=Side(style='thin')
    )
    
    # Risk level colors
    high_risk_fill = PatternFill(start_color='FF0000', end_color='FF0000', fill_type='solid')
    medium_risk_fill = PatternFill(start_color='FFC000', end_color='FFC000', fill_type='solid')
    low_risk_fill = PatternFill(start_color='00B050', end_color='00B050', fill_type='solid')
    
    for sheet_name in wb.sheetnames:
        ws = wb[sheet_name]
        
        # Format headers
        for cell in ws[1]:
            cell.fill = header_fill
            cell.font = header_font
            cell.alignment = center_alignment
            cell.border = border
        
        # Auto-adjust column widths
        for column in ws.columns:
            max_length = 0
            column_letter = get_column_letter(column[0].column)
            for cell in column:
                try:
                    if len(str(cell.value)) > max_length:
                        max_length = len(str(cell.value))
                except:
                    pass
            adjusted_width = min(max_length + 2, 30)
            ws.column_dimensions[column_letter].width = adjusted_width
        
        # Apply conditional formatting for collision probability
        if 'collision_probability' in [cell.value for cell in ws[1]]:
            col_idx = None
            for idx, cell in enumerate(ws[1], 1):
                if cell.value == 'collision_probability':
                    col_idx = idx
                    break
            
            if col_idx:
                col_letter = get_column_letter(col_idx)
                for row in range(2, ws.max_row + 1):
                    cell = ws[f'{col_letter}{row}']
                    if cell.value is not None:
                        value = float(cell.value)
                        if value > 0.7:
                            cell.fill = high_risk_fill
                            cell.font = Font(color='FFFFFF', bold=True)
                        elif value > 0.4:
                            cell.fill = medium_risk_fill
                        elif value > 0:
                            cell.fill = low_risk_fill
        
        # Apply formatting to alert column
        if 'collision_alert' in [cell.value for cell in ws[1]]:
            col_idx = None
            for idx, cell in enumerate(ws[1], 1):
                if cell.value == 'collision_alert':
                    col_idx = idx
                    break
            
            if col_idx:
                col_letter = get_column_letter(col_idx)
                for row in range(2, ws.max_row + 1):
                    cell = ws[f'{col_letter}{row}']
                    if cell.value == 'HIGH':
                        cell.fill = high_risk_fill
                        cell.font = Font(color='FFFFFF', bold=True)
                    elif cell.value == 'MEDIUM':
                        cell.fill = medium_risk_fill
                    elif cell.value == 'LOW':
                        cell.fill = low_risk_fill
        
        # Add borders to all cells
        for row in ws.iter_rows(min_row=1, max_row=ws.max_row, min_col=1, max_col=ws.max_column):
            for cell in row:
                cell.border = border
        
        # Add freeze panes
        ws.freeze_panes = 'A2'
    
    # Add summary dashboard sheet
    add_dashboard_sheet(wb)
    
    wb.save(filename)

def add_dashboard_sheet(wb):
    """
    Add a dashboard sheet with charts and summary
    """
    from openpyxl.chart import LineChart, BarChart, Reference, PieChart
    from openpyxl.drawing.image import Image
    
    # Create dashboard sheet
    if 'Dashboard' in wb.sheetnames:
        ws_dash = wb['Dashboard']
    else:
        ws_dash = wb.create_sheet('Dashboard')
    
    # Add title
    ws_dash['A1'] = 'COLLISION RISK ANALYSIS DASHBOARD'
    ws_dash['A1'].font = Font(size=16, bold=True, color='366092')
    
    # Get data from other sheets
    raw_data = wb['Raw_Data']
    summary = wb['Summary_Statistics']
    
    # Summary statistics
    ws_dash['A3'] = 'Overall Statistics'
    ws_dash['A3'].font = Font(bold=True, size=12)
    
    # Calculate overall stats
    total_vehicles = summary.max_row - 1
    high_risk_count = 0
    for row in range(2, summary.max_row + 1):
        high_risk_count += summary[f'G{row}'].value
    
    ws_dash['A4'] = f'Total Vehicles: {total_vehicles}'
    ws_dash['A5'] = f'Total Data Points: {raw_data.max_row - 1}'
    ws_dash['A6'] = f'High Risk Events: {high_risk_count}'
    ws_dash['A7'] = f'Analysis Time Range: 0 - {max(raw_data[f"A{row}"].value for row in range(2, raw_data.max_row + 1))}'
    
    # Add charts
    # Chart 1: Collision probability over time for each vehicle
    chart1 = LineChart()
    chart1.title = "Collision Probability Over Time"
    chart1.style = 13
    chart1.y_axis.title = "Probability"
    chart1.x_axis.title = "Timestamp"
    
    data = Reference(raw_data, min_col=8, min_row=1, max_row=min(51, raw_data.max_row))
    cats = Reference(raw_data, min_col=1, min_row=2, max_row=min(51, raw_data.max_row))
    chart1.add_data(data, titles_from_data=True)
    chart1.set_categories(cats)
    
    ws_dash.add_chart(chart1, "A10")
    
    # Chart 2: Risk distribution by vehicle
    chart2 = BarChart()
    chart2.title = "Average Collision Risk by Vehicle"
    chart2.style = 11
    
    data = Reference(summary, min_col=5, min_row=1, max_row=summary.max_row, max_col=5)
    cats = Reference(summary, min_col=1, min_row=2, max_row=summary.max_row)
    chart2.add_data(data, titles_from_data=True)
    chart2.set_categories(cats)
    
    ws_dash.add_chart(chart2, "A30")
    
    # Chart 3: Risk level distribution
    chart3 = PieChart()
    chart3.title = "Risk Level Distribution"
    
    # Calculate risk distribution
    risk_counts = {'HIGH': 0, 'MEDIUM': 0, 'LOW': 0}
    for row in range(2, raw_data.max_row + 1):
        alert = raw_data[f'H{row}'].value
        if alert in risk_counts:
            risk_counts[alert] += 1
    
    # Add data to a temporary range
    ws_dash['J1'] = 'Risk Level'
    ws_dash['K1'] = 'Count'
    ws_dash['J2'] = 'HIGH'
    ws_dash['K2'] = risk_counts['HIGH']
    ws_dash['J3'] = 'MEDIUM'
    ws_dash['K3'] = risk_counts['MEDIUM']
    ws_dash['J4'] = 'LOW'
    ws_dash['K4'] = risk_counts['LOW']
    
    data = Reference(ws_dash, min_col=2, min_row=1, max_row=4, max_col=2)
    cats = Reference(ws_dash, min_col=1, min_row=2, max_row=4)
    chart3.add_data(data, titles_from_data=True)
    chart3.set_categories(cats)
    
    ws_dash.add_chart(chart3, "J10")
    
    # Format dashboard
    for col in ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K']:
        ws_dash.column_dimensions[col].width = 15
    
    # Add analysis notes
    ws_dash['A50'] = 'ANALYSIS NOTES:'
    ws_dash['A50'].font = Font(bold=True, size=12)
    ws_dash['A51'] = '1. Collision Probability > 0.7 indicates HIGH risk'
    ws_dash['A52'] = '2. Probability 0.4-0.7 indicates MEDIUM risk'
    ws_dash['A53'] = '3. Probability < 0.4 indicates LOW risk'
    ws_dash['A54'] = '4. Risk calculated based on distance, speed, and acceleration'
    ws_dash['A55'] = '5. Generated using AI-based collision prediction model'

def generate_sample_data_file():
    """
    Generate a sample CSV file similar to the provided example
    """
    sample_data = []
    
    # Generate 20 timesteps for vehicle 1
    for t in range(20):
        sample_data.append({
            'timestamp': t,
            'vehicle_id': 1,
            'position_x': 10.5 + t * 1.2,
            'position_y': 20.3 + t * 0.8,
            'velocity_x': 1.2,
            'velocity_y': 0.8
        })
    
    df_sample = pd.DataFrame(sample_data)
    df_sample.to_csv('sample_vehicle_data.csv', index=False)
    print("Sample CSV file generated: sample_vehicle_data.csv")
    
    return df_sample

# Generate the files
if __name__ == "__main__":
    print("=" * 60)
    print("COLLISION RISK ANALYSIS GENERATOR")
    print("=" * 60)
    
    # Generate sample CSV
    print("\n1. Generating sample vehicle data...")
    sample_df = generate_sample_data_file()
    
    # Generate comprehensive analysis Excel
    print("\n2. Generating comprehensive collision analysis...")
    excel_file, full_df = generate_collision_analysis_excel()
    
    print("\n" + "=" * 60)
    print("GENERATION COMPLETE!")
    print("=" * 60)
    print("\nGenerated Files:")
    print(f"1. sample_vehicle_data.csv - Simple vehicle trajectory")
    print(f"2. {excel_file} - Comprehensive analysis with:")
    print("   - Raw data with collision probabilities")
    print("   - Summary statistics by vehicle")
    print("   - High risk event tracking")
    print("   - Time-based analysis")
    print("   - Trajectory analysis")
    print("   - Interactive dashboard with charts")
    print("\nFiles include:")
    print("✓ Color-coded risk levels (RED=High, ORANGE=Medium, GREEN=Low)")
    print("✓ Automatic column formatting")
    print("✓ Charts and visualizations")
    print("✓ Professional dashboard layout")
    
    # Display sample of data
    print("\n" + "=" * 60)
    print("SAMPLE DATA (First 5 rows):")
    print("=" * 60)
    print(full_df[['timestamp', 'vehicle_id', 'position_x', 'position_y', 
                   'collision_probability', 'collision_alert']].head().to_string())
    
    # Show risk distribution
    print("\n" + "=" * 60)
    print("RISK DISTRIBUTION:")
    print("=" * 60)
    risk_counts = full_df['collision_alert'].value_counts()
    for risk_level, count in risk_counts.items():
        print(f"{risk_level}: {count} records ({count/len(full_df)*100:.1f}%)")
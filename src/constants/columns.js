export const DEFECT_COLUMNS = [
  { header: 'Site ID', key: 'id', width: 10 },
  { header: 'Site Name', key: 'site_name', width: 30 },
  // orange
  { header: 'Date of Survey', key: 'survey_date', width: 20 },
  { header: 'Survey Status', key: 'survey_status', width: 20 },
  { header: 'Survey Completed', key: 'date_survey_completed', width: 20 },
  { header: 'Quality Engineer', key: 'quality_review_engineer', width: 30 },
  { header: 'Quality Review Status', key: 'quality_review_status', width: 30 },
  { header: 'Quality Acceptance', key: 'date_quality_acceptance', width: 30 },
  { header: 'Final Acceptance', key: 'date_final_acceptance', width: 20 },
  // defects
  { header: 'Defect Type', key: 'defect_type', width: 50 },
  { header: 'Unused Equipment', key: 'unused_equipment', width: 20 },
  { header: 'Defect Area', key: 'defect_area', width: 20 },
  { header: 'Defect Grade', key: 'defect_grade', width: 20 },
  { header: 'Location / Position', key: 'position_on_site', width: 50 },
  { header: 'Description / Comments', key: 'description', width: 50 },
]

export const DEFECT_ASSESSMENT_COLUMNS = [
  { header: 'Site ID', key: 'id', width: 10 },
  { header: 'Type', key: 'type', width: 30 },
  { header: 'Assessment', key: 'assessment', width: 40 },
]

export const STRUCTURE_COLUMNS = [
  // yellow: site details
  { header: 'Site ID', key: 'id', width: 15 },
  { header: 'Site Name', key: 'site_name', width: 30 },
  { header: 'Latitude', key: 'latitude', width: 15 },
  { header: 'Longitude', key: 'longitude', width: 15 },
  { header: 'Rooftop/ Ground based', key: 'site_type', width: 25 },
  { header: 'Building Height', key: 'building_height', width: 15 },
  { header: 'Structure Type', key: 'structure_type', width: 15 },
  { header: 'Fall Arrest System', key: 'fall_arrest', width: 20 },
  // orange
  { header: 'Date of Survey', key: 'survey_date', width: 20 },
  { header: 'Survey Status', key: 'survey_status', width: 20 },
  { header: 'Survey Completed', key: 'date_survey_completed', width: 20 },
  { header: 'Quality Engineer', key: 'quality_review_engineer', width: 30 },
  { header: 'Quality Review Status', key: 'quality_review_status', width: 30 },
  { header: 'Quality Acceptance', key: 'date_quality_acceptance', width: 30 },
  { header: 'Final Acceptance', key: 'date_final_acceptance', width: 20 },
  // structures
  { header: 'Structure', key: 'structureId', width: 15 },
  { header: 'Type', key: 'equipment_type', width: 15 },
  { header: 'Height (m) (to centre)', key: 'equipment_height_m', width: 25 },
  { header: 'Azimuth (Orientation)', key: 'azimuth', width: 25 },
  { header: 'Leg', key: 'tower_leg', width: 10 },
  { header: 'Length (mm)', key: 'length_mm', width: 10 },
  { header: 'Width (mm)', key: 'width_mm', width: 10 },
  { header: 'Depth (mm)', key: 'depth_mm', width: 10 },
  { header: 'Diameter (m) - if MW', key: 'mw_dish_dia_mm', width: 12 },
]

export const COLUMN_NAMES = [
  // yellow: site details
  { header: 'Site ID', key: 'id', width: 15 },
  { header: 'Site Name', key: 'site_name', width: 30 },
  { header: 'Latitude', key: 'latitude', width: 15 },
  { header: 'Longitude', key: 'longitude', width: 15 },
  { header: 'Rooftop/ Ground based', key: 'site_type', width: 25 },
  { header: 'Building Height', key: 'building_height', width: 15 },
  // { header: 'Structure Type', key: 'structure_type', width: 15 },
  // first structure
  { header: 'Tower Type', key: 'tower_type', width: 20 },
  { header: 'No of Structures', key: 'amount_structures', width: 15 },
  { header: 'Tower Height', key: 'tower_height', width: 15 },
  // orange
  { header: 'Date of Survey', key: 'survey_date', width: 20 },
  { header: 'Survey Status', key: 'survey_status', width: 20 },
  { header: 'Survey Completed', key: 'date_survey_completed', width: 20 },
  { header: 'Quality Engineer', key: 'quality_review_engineer', width: 30 },
  { header: 'Quality Review Status', key: 'quality_review_status', width: 30 },
  { header: 'Quality Acceptance', key: 'date_quality_acceptance', width: 30 },
  { header: 'Final Acceptance', key: 'date_final_acceptance', width: 20 },

  // shelters
  // TODO add 1 + 2 + 3
  { header: 'Number of Rooms/Shelters', key: 'amount_shelters', width: 15 },
  { header: 'Room/Shelter Type', key: '', width: 15 },
  { header: 'Room/Shelter Length (m)', key: '', width: 15 },
  { header: 'Room/Shelter Width (m)', key: '', width: 15 },
  { header: 'Room / Shelter Dimension (m x m)', key: '', width: 15 },
  { header: 'MTD Room / Shelter Dimension (m x m) - cleaned', key: '', width: 15 },
  { header: 'Room/Shelter Height (m)', key: '', width: 15 },
  // rectifiers
  { header: 'Rectifier Count', key: 'amount_rectifiers', width: 15 },
  { header: 'Rectifier 1 Brand', key: 'rectifier_1_rectifier_brand', width: 15 },
  { header: 'Rectifier 1 Model', key: 'rectifier_1_rectifier_model', width: 15 },
  { header: 'Rectifier 1 Nameplate Capacity (kW)', key: 'rectifier_1_rectifier_nameplate_capacity_kw', width: 15 },
  { header: 'Module 1 Slots Un-used', key: 'rectifier_1_module_slots_unused', width: 15 },
  { header: 'Module 1 Size (W)', key: 'rectifier_1_module_size_w', width: 15 },
  { header: 'Module 1 Slots Installed', key: 'rectifier_1_modules_slots_installed', width: 15 },
  { header: 'Rectifier 2 Brand', key: 'rectifier_2_rectifier_brand', width: 15 },
  { header: 'Rectifier 2 Model', key: 'rectifier_2_rectifier_model', width: 15 },
  { header: 'Rectifier 2 Nameplate Capacity (kW)', key: 'rectifier_2_rectifier_nameplate_capacity_kw', width: 15 },
  { header: 'Module 2 Slots Un-used', key: 'rectifier_2_module_slots_unused', width: 15 },
  { header: 'Module 2 Size (W)', key: 'rectifier_2_module_size_w', width: 15 },
  { header: 'Module 2 Slots Installed', key: 'rectifier_2_modules_slots_installed', width: 15 },
  { header: 'Rectifier 3 Brand', key: 'rectifier_3_rectifier_brand', width: 15 },
  { header: 'Rectifier 3 Model', key: 'rectifier_3_rectifier_model', width: 15 },
  { header: 'Rectifier 3 Nameplate Capacity (kW)', key: 'rectifier_3_rectifier_nameplate_capacity_kw', width: 15 },
  { header: 'Module 3 Slots Un-used', key: 'rectifier_3_module_slots_unused', width: 15 },
  { header: 'Module 3 Size (W)', key: 'rectifier_3_module_size_w', width: 15 },
  { header: 'Module 3 Slots Installed', key: 'rectifier_3_modules_slots_installed', width: 15 },
  // batteries
  { header: 'Battery bank Count', key: 'amount_batteries', width: 15 },
  { header: 'Battery 1 Charged by Rectifier', key: 'battery_1_charged_by_rectifier', width: 15 },
  { header: 'Battery 1 Brand', key: 'battery_1_battery_brand', width: 15 },
  { header: 'Battery 1 Type', key: 'battery_1_battery_type', width: 15 },
  { header: 'Battery 1 VRLA String Count', key: 'battery_1_vrla_string_count', width: 15 },
  { header: 'Battery 1 VRLA Cell Count', key: 'battery_1_vrla_cell_count', width: 15 },
  { header: 'Battery 1 VRLA Cell Capacity (Ah)', key: 'battery_1_vrla_cell_capacity_ah', width: 15 },
  { header: 'Battery 1 Li-Ion Battery/Cell Count', key: 'battery_1_liion_batterycell_count', width: 15 },
  { header: 'Battery 1 Li-Ion Capacity (Ah)', key: 'battery_1_liion_capacity_ah', width: 15 },
  { header: 'Battery 1 Installation Type', key: 'battery_1_installation_type', width: 15 },
  { header: 'Battery 2 Charged by Rectifier', key: 'battery_2_charged_by_rectifier', width: 15 },
  { header: 'Battery 2 Brand', key: 'battery_2_battery_brand', width: 15 },
  { header: 'Battery 2 Type', key: 'battery_2_battery_type', width: 15 },
  { header: 'Battery 2 VRLA String Count', key: 'battery_2_vrla_string_count', width: 15 },
  { header: 'Battery 2 VRLA Cell Count', key: 'battery_2_vrla_cell_count', width: 15 },
  { header: 'Battery 2 VRLA Cell Capacity (Ah)', key: 'battery_2_vrla_cell_capacity_ah', width: 15 },
  { header: 'Battery 2 Li-Ion Battery/Cell Count', key: 'battery_2_liion_batterycell_count', width: 15 },
  { header: 'Battery 2 Li-Ion Capacity (Ah)', key: 'battery_2_liion_capacity_ah', width: 15 },
  { header: 'Battery 2 Installation Type', key: 'battery_2_installation_type', width: 15 },
  { header: 'Battery 3 Charged by Rectifier', key: 'battery_3_charged_by_rectifier', width: 15 },
  { header: 'Battery 3 Brand', key: 'battery_3_battery_brand', width: 15 },
  { header: 'Battery 3 Type', key: 'battery_3_battery_type', width: 15 },
  { header: 'Battery 3 VRLA String Count', key: 'battery_3_vrla_string_count', width: 15 },
  { header: 'Battery 3 VRLA Cell Count', key: 'battery_3_vrla_cell_count', width: 15 },
  { header: 'Battery 3 VRLA Cell Capacity (Ah)', key: 'battery_3_vrla_cell_capacity_ah', width: 15 },
  { header: 'Battery 3 Li-Ion Battery/Cell Count', key: 'battery_3_liion_batterycell_count', width: 15 },
  { header: 'Battery 3 Li-Ion Capacity (Ah)', key: 'battery_3_liion_capacity_ah', width: 15 },
  { header: 'Battery 3 Installation Type', key: 'battery_3_installation_type', width: 15 },
  { header: 'Battery 4 Charged by Rectifier', key: 'battery_4_charged_by_rectifier', width: 15 },
  { header: 'Battery 4 Brand', key: 'battery_4_battery_brand', width: 15 },
  { header: 'Battery 4 Type', key: 'battery_4_battery_type', width: 15 },
  { header: 'Battery 4 VRLA String Count', key: 'battery_4_vrla_string_count', width: 15 },
  { header: 'Battery 4 VRLA Cell Count', key: 'battery_4_vrla_cell_count', width: 15 },
  { header: 'Battery 4 VRLA Cell Capacity (Ah)', key: 'battery_4_vrla_cell_capacity_ah', width: 15 },
  { header: 'Battery 4 Li-Ion Battery/Cell Count', key: 'battery_4_liion_batterycell_count', width: 15 },
  { header: 'Battery 4 Li-Ion Capacity (Ah)', key: 'battery_4_liion_capacity_ah', width: 15 },
  { header: 'Battery 4 Installation Type', key: 'battery_4_installation_type', width: 15 },
  { header: 'Battery 5 Charged by Rectifier', key: 'battery_5_charged_by_rectifier', width: 15 },
  { header: 'Battery 5 Brand', key: 'battery_5_battery_brand', width: 15 },
  { header: 'Battery 5 Type', key: 'battery_5_battery_type', width: 15 },
  { header: 'Battery 5 VRLA String Count', key: 'battery_5_vrla_string_count', width: 15 },
  { header: 'Battery 5 VRLA Cell Count', key: 'battery_5_vrla_cell_count', width: 15 },
  { header: 'Battery 5 VRLA Cell Capacity (Ah)', key: 'battery_5_vrla_cell_capacity_ah', width: 15 },
  { header: 'Battery 5 Li-Ion Battery/Cell Count', key: 'battery_5_liion_batterycell_count', width: 15 },
  { header: 'Battery 5 Li-Ion Capacity (Ah)', key: 'battery_5_liion_capacity_ah', width: 15 },
  { header: 'Battery 5 Installation Type', key: 'battery_5_installation_type', width: 15 },
  // generators
  { header: 'Generator Count', key: 'amount_generators', width: 15 },
  { header: 'Generator 1 Size (kVA)', key: 'generator_1_generator_size_kva', width: 15 },
  { header: 'Generator 1 Brand', key: 'generator_1_generator_brand', width: 15 },
  { header: 'Generator 1 Fuel tank capacity (Ltr)', key: 'generator_1_fuel_tank_capacity_ltr', width: 15 },
  { header: 'Generator 1 Measured Fuel Level (Ltrs)', key: 'generator_1_measured_fuel_levels_ltrs', width: 15 },
  { header: 'Generator 1 DG Controller Brand', key: 'generator_1_dg_controller_brand', width: 15 },
  { header: 'Generator 1 Functionality', key: 'generator_1_generator_functionality', width: 15 },
  { header: 'Generator 1 DG Run-hours (if available)', key: 'generator_1_dg_runhours_if_available', width: 15 },
  { header: 'Generator 2 Size (kVA)', key: 'generator_2_generator_size_kva', width: 15 },
  { header: 'Generator 2 Brand', key: 'generator_2_generator_brand', width: 15 },
  { header: 'Generator 2 Fuel tank capacity (Ltr)', key: 'generator_2_fuel_tank_capacity_ltr', width: 15 },
  { header: 'Generator 2 Measured Fuel Level (Ltrs)', key: 'generator_2_measured_fuel_levels_ltrs', width: 15 },
  { header: 'Generator 2 DG Controller Brand', key: 'generator_2_dg_controller_brand', width: 15 },
  { header: 'Generator 2 Functionality', key: 'generator_2_generator_functionality', width: 15 },
  { header: 'Generator 2 DG Run-hours (if available)', key: 'generator_2_dg_runhours_if_available', width: 15 },
  { header: 'Generator 3 Size (kVA)', key: 'generator_3_generator_size_kva', width: 15 },
  { header: 'Generator 3 Brand', key: 'generator_3_generator_brand', width: 15 },
  { header: 'Generator 3 Fuel tank capacity (Ltr)', key: 'generator_3_fuel_tank_capacity_ltr', width: 15 },
  { header: 'Generator 3 Measured Fuel Level (Ltrs)', key: 'generator_3_measured_fuel_levels_ltrs', width: 15 },
  { header: 'Generator 3 DG Controller Brand', key: 'generator_3_dg_controller_brand', width: 15 },
  { header: 'Generator 3 Functionality', key: 'generator_3_generator_functionality', width: 15 },
  { header: 'Generator 3 DG Run-hours (if available)', key: 'generator_3_dg_runhours_if_available', width: 15 },
  { header: 'Yes/No - Transfer Switch on site?', key: 'transfer_switch_on_site', width: 15 },
  { header: 'Transfer Switch Type Type', key: 'transfer_switch_type_type', width: 15 },
  // acu
  { header: 'ACU Count', key: 'amount_acu', width: 15 },
  { header: 'ACU 1 Count', key: 'acu_1_acu_count', width: 15 },
  { header: 'ACU 1 Type', key: 'acu_1_acu_type', width: 15 },
  { header: 'ACU 1 Brand', key: 'acu_1_acu_brand', width: 15 },
  { header: 'ACU 1 Capacity', key: 'acu_1_acu_capacity', width: 15 },
  { header: 'ACU 2 Count', key: 'acu_2_acu_count', width: 15 },
  { header: 'ACU 2 Type', key: 'acu_2_acu_type', width: 15 },
  { header: 'ACU 2 Brand', key: 'acu_2_acu_brand', width: 15 },
  { header: 'ACU 2 Capacity', key: 'acu_2_acu_capacity', width: 15 },
  { header: 'ACU 3 Count', key: 'acu_3_acu_count', width: 15 },
  { header: 'ACU 3 Type', key: 'acu_3_acu_type', width: 15 },
  { header: 'ACU 3 Brand', key: 'acu_3_acu_brand', width: 15 },
  { header: 'ACU 3 Capacity', key: 'acu_3_acu_capacity', width: 15 },
  { header: 'ACU 4 Count', key: 'acu_4_acu_count', width: 15 },
  { header: 'ACU 4 Type', key: 'acu_4_acu_type', width: 15 },
  { header: 'ACU 4 Brand', key: 'acu_4_acu_brand', width: 15 },
  { header: 'ACU 4 Capacity', key: 'acu_4_acu_capacity', width: 15 },
  { header: 'ACU 5 Count', key: 'acu_5_acu_count', width: 15 },
  { header: 'ACU 5 Type', key: 'acu_5_acu_type', width: 15 },
  { header: 'ACU 5 Brand', key: 'acu_5_acu_brand', width: 15 },
  { header: 'ACU 5 Capacity', key: 'acu_5_acu_capacity', width: 15 },
  { header: 'ACU 6 Count', key: 'acu_6_acu_count', width: 15 },
  { header: 'ACU 6 Type', key: 'acu_6_acu_type', width: 15 },
  { header: 'ACU 6 Brand', key: 'acu_6_acu_brand', width: 15 },
  { header: 'ACU 6 Capacity', key: 'acu_6_acu_capacity', width: 15 },
  { header: 'ACU 7 Count', key: 'acu_7_acu_count', width: 15 },
  { header: 'ACU 7 Type', key: 'acu_7_acu_type', width: 15 },
  { header: 'ACU 7 Brand', key: 'acu_7_acu_brand', width: 15 },
  { header: 'ACU 7 Capacity', key: 'acu_7_acu_capacity', width: 15 },
  { header: 'ACU 8 Count', key: 'acu_8_acu_count', width: 15 },
  { header: 'ACU 8 Type', key: 'acu_8_acu_type', width: 15 },
  { header: 'ACU 8 Brand', key: 'acu_8_acu_brand', width: 15 },
  { header: 'ACU 8 Capacity', key: 'acu_8_acu_capacity', width: 15 },
  { header: 'ACU 9 Count', key: 'acu_9_acu_count', width: 15 },
  { header: 'ACU 9 Type', key: 'acu_9_acu_type', width: 15 },
  { header: 'ACU 9 Brand', key: 'acu_9_acu_brand', width: 15 },
  { header: 'ACU 9 Capacity', key: 'acu_9_acu_capacity', width: 15 },

  // nearby
  { header: 'Yes/No - Are there any other sites/towers within 500m?', key: 'other_sitestowers_within_500m', width: 15 },
  { header: 'Within 0 to 100m', key: 'within_0_to_100m', width: 15 },
  { header: 'Within 100m to 200m', key: 'within_100m_to_200m', width: 15 },
  { header: 'Within 200m to 300m', key: 'within_200m_to_300m', width: 15 },
  { header: 'Within 300m to 500m', key: 'within_300m_to_500m', width: 15 },

  // compound details
  { header: 'Yes/No - Record Compound and Fence Details?', key: 'record_compound_and_fence_details', width: 15 },
  { header: 'Length (m)', key: 'compound_length_m', width: 15 },
  { header: 'Width (m)', key: 'compound_width_m', width: 15 },
  { header: 'External Photos', key: 'compound_external_photos', width: 15 },

  // earthing
  { header: 'Record Site Earthing Status - Record Site Earthing details?', key: 'record_site_earthing_details', width: 15 },
  { header: 'Site Earthing Status', key: 'site_earthing_status', width: 15 },

  // transmission
  { header: 'Yes/No - Record Transmission Type', key: 'record_transmission_type', width: 15 },
  { header: 'Transmission Type', key: 'transmission_type', width: 25 },

  // distribution
  { header: 'Yes/No - Record Site AC Distribution Details?', key: 'record_site_ac_distribution_details', width: 15 },

  // grid connection details
  { header: 'Grid Connection', key: 'grid_connection', width: 30 },
  { header: 'No. of Phases', key: 'no_of_phases', width: 15 },
  { header: 'Transformer Count', key: 'transformer_count', width: 15 },
  { header: 'Transformer #1 Size', key: 'transformer_1_size', width: 15 },
  { header: 'Transformer #2 Size', key: 'transformer_2_size', width: 15 },
  { header: 'Transformer #3 Size', key: 'transformer_3_size', width: 15 },

  // other
  { header: 'Yes/No - Surge Suppression Installed', key: 'surge_suppression_installed', width: 15 },
  { header: 'Location of equipment Base Pads', key: 'location_of_equipment_base_pads', width: 15 },

  // plinth
  { header: 'Plinth Length (mm)', key: 'plinth_length_mm', width: 15 },
  { header: 'Plinth Width (mm)', key: 'plinth_width_mm', width: 15 },
  { header: 'Height above ground (mm)', key: 'height_above_ground_mm', width: 15 },
  { header: 'Recording space available', key: 'recording_space_available', width: 15 },
  { header: 'Space unused', key: 'space_unused', width: 15 },

  { header: 'Yes/No - Automatic Voltage Regulator Installed?', key: 'automatic_voltage_regulator_installed', width: 15 },
  { header: 'Tower Works Completed or Ongoing', key: 'recent_ongoing_tower_works', width: 30 },
  { header: 'Describe Recent/Ongoing Work', key: 'record_tower_works', width: 30 },

  // unknown
  // { header: 'Yes/No - Record Unused Equipment in the Room/Shelter', key: '', width: 15 },
  // { header: 'Location in Room/Shelter', key: '', width: 15 },
  // { header: 'Equipment description', key: '', width: 15 },
  // { header: 'Yes/No - Record Room/Shelter and Rectifier/Battery/ACU defects?', key: '', width: 15 },
  // { header: 'Defect Area', key: '', width: 15 },
  // { header: 'Defect Grade', key: '', width: 15 },
  // { header: 'Position in Room/Shelter', key: '', width: 15 },
  // { header: 'Yes/No - Record Recent/Ongoing Structure Works', key: '', width: 15 },
  // { header: 'Yes/No - Record Grid Details', key: '', width: 15 },
  // { header: 'Yes/No - Record Compound and External equipment Defects?', key: '', width: 15 },
  // { header: 'Defect Area', key: '', width: 15 },
  // { header: 'Defect Grade', key: '', width: 15 },
  // { header: 'Position on Site', key: '', width: 15 },
  // { header: 'Defect description', key: '', width: 15 },
  // { header: 'Yes/No - Record Unused Equipment in the Compound', key: '', width: 15 },
  // { header: 'Location on Site', key: '', width: 15 },
  // { header: 'Equipment description', key: '', width: 15 },

];

// TODO: remove duplicates. e.g. G8381, 3826
// TODO: empty tower type means they filled in the tower type in structure 8 not structure 1
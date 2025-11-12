import { CustomFieldConfig, LanguageCode } from "@vendure/core";

// export const measurementsSchema: CustomFieldConfig = {
//   name: "measurements",
//   type: "struct",
//   label: [{ languageCode: LanguageCode.en, value: "Measurements" }],
//   fields: [
//     {
//       name: "womens_upper_body_head_and_neck_head_circumference",
//       type: "float",
//       label: [{ languageCode: LanguageCode.en, value: "Head Circumference" }],
//       description: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Women's - Upper Body - Head & Neck",
//         },
//       ],
//     },
//     {
//       name: "womens_upper_body_head_and_neck_neck_circumference_base_of_neck",
//       type: "float",
//       label: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Neck Circumference (Base of Neck)",
//         },
//       ],
//       description: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Women's - Upper Body - Head & Neck",
//         },
//       ],
//     },
//     {
//       name: "womens_upper_body_head_and_neck_neck_height_front",
//       type: "float",
//       label: [{ languageCode: LanguageCode.en, value: "Neck Height (Front)" }],
//       description: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Women's - Upper Body - Head & Neck",
//         },
//       ],
//     },
//     {
//       name: "womens_upper_body_head_and_neck_neck_height_back",
//       type: "float",
//       label: [{ languageCode: LanguageCode.en, value: "Neck Height (Back)" }],
//       description: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Women's - Upper Body - Head & Neck",
//         },
//       ],
//     },
//     {
//       name: "womens_upper_body_shoulders_and_chest_shoulder_width_point_to_point",
//       type: "float",
//       label: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Shoulder Width (Point-to-Point)",
//         },
//       ],
//       description: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Women's - Upper Body - Shoulders & Chest",
//         },
//       ],
//     },
//     {
//       name: "womens_upper_body_shoulders_and_chest_shoulder_slope_left",
//       type: "float",
//       label: [
//         { languageCode: LanguageCode.en, value: "Shoulder Slope (Left)" },
//       ],
//       description: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Women's - Upper Body - Shoulders & Chest",
//         },
//       ],
//     },
//     {
//       name: "womens_upper_body_shoulders_and_chest_shoulder_slope_right",
//       type: "float",
//       label: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Shoulder Slope (Right)",
//         },
//       ],
//       description: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Women's - Upper Body - Shoulders & Chest",
//         },
//       ],
//     },
//     {
//       name: "womens_upper_body_shoulders_and_chest_shoulder_to_bust_point_apex",
//       type: "float",
//       label: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Shoulder to Bust Point (Apex)",
//         },
//       ],
//       description: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Women's - Upper Body - Shoulders & Chest",
//         },
//       ],
//     },
//     {
//       name: "womens_upper_body_shoulders_and_chest_shoulder_to_waist_front",
//       type: "float",
//       label: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Shoulder to Waist (Front)",
//         },
//       ],
//       description: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Women's - Upper Body - Shoulders & Chest",
//         },
//       ],
//     },
//     {
//       name: "womens_upper_body_shoulders_and_chest_shoulder_to_waist_back",
//       type: "float",
//       label: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Shoulder to Waist (Back)",
//         },
//       ],
//       description: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Women's - Upper Body - Shoulders & Chest",
//         },
//       ],
//     },
//     {
//       name: "womens_upper_body_shoulders_and_chest_across_chest_front_armhole_level",
//       type: "float",
//       label: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Across Chest (Front, Armhole Level)",
//         },
//       ],
//       description: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Women's - Upper Body - Shoulders & Chest",
//         },
//       ],
//     },
//     {
//       name: "womens_upper_body_shoulders_and_chest_across_back_back_width_at_armhole_level",
//       type: "float",
//       label: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Across Back (Back Width at Armhole Level)",
//         },
//       ],
//       description: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Women's - Upper Body - Shoulders & Chest",
//         },
//       ],
//     },
//     {
//       name: "womens_upper_body_shoulders_and_chest_bust_point_to_bust_point_apex_to_apex",
//       type: "float",
//       label: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Bust Point to Bust Point (Apex to Apex)",
//         },
//       ],
//       description: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Women's - Upper Body - Shoulders & Chest",
//         },
//       ],
//     },
//     {
//       name: "womens_upper_body_shoulders_and_chest_bust_circumference_fullest_point",
//       type: "float",
//       label: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Bust Circumference (Fullest Point)",
//         },
//       ],
//       description: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Women's - Upper Body - Shoulders & Chest",
//         },
//       ],
//     },
//     {
//       name: "womens_upper_body_shoulders_and_chest_high_bust_circumference",
//       type: "float",
//       label: [
//         {
//           languageCode: LanguageCode.en,
//           value: "High Bust Circumference",
//         },
//       ],
//       description: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Women's - Upper Body - Shoulders & Chest",
//         },
//       ],
//     },
//     {
//       name: "womens_upper_body_shoulders_and_chest_underbust_circumference",
//       type: "float",
//       label: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Underbust Circumference",
//         },
//       ],
//       description: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Women's - Upper Body - Shoulders & Chest",
//         },
//       ],
//     },
//     {
//       name: "womens_upper_body_shoulders_and_chest_bust_height_neck_base_to_apex",
//       type: "float",
//       label: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Bust Height (Neck Base to Apex)",
//         },
//       ],
//       description: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Women's - Upper Body - Shoulders & Chest",
//         },
//       ],
//     },
//     {
//       name: "womens_upper_body_shoulders_and_chest_bust_depth_side_seam_to_apex",
//       type: "float",
//       label: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Bust Depth (Side Seam to Apex)",
//         },
//       ],
//       description: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Women's - Upper Body - Shoulders & Chest",
//         },
//       ],
//     },
//     {
//       name: "womens_upper_body_shoulders_and_chest_armhole_depth_front",
//       type: "float",
//       label: [
//         { languageCode: LanguageCode.en, value: "Armhole Depth (Front)" },
//       ],
//       description: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Women's - Upper Body - Shoulders & Chest",
//         },
//       ],
//     },
//     {
//       name: "womens_upper_body_shoulders_and_chest_armhole_depth_back",
//       type: "float",
//       label: [{ languageCode: LanguageCode.en, value: "Armhole Depth (Back)" }],
//       description: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Women's - Upper Body - Shoulders & Chest",
//         },
//       ],
//     },
//     {
//       name: "womens_upper_body_arms_and_sleeves_arm_length_shoulder_to_wrist",
//       type: "float",
//       label: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Arm Length (Shoulder to Wrist)",
//         },
//       ],
//       description: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Women's - Upper Body - Arms & Sleeves",
//         },
//       ],
//     },
//     {
//       name: "womens_upper_body_arms_and_sleeves_arm_length_shoulder_to_elbow",
//       type: "float",
//       label: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Arm Length (Shoulder to Elbow)",
//         },
//       ],
//       description: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Women's - Upper Body - Arms & Sleeves",
//         },
//       ],
//     },
//     {
//       name: "womens_upper_body_arms_and_sleeves_overarm_length_across_bent_elbow",
//       type: "float",
//       label: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Overarm Length (Across Bent Elbow)",
//         },
//       ],
//       description: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Women's - Upper Body - Arms & Sleeves",
//         },
//       ],
//     },
//     {
//       name: "womens_upper_body_arms_and_sleeves_underarm_length_armpit_to_wrist",
//       type: "float",
//       label: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Underarm Length (Armpit to Wrist)",
//         },
//       ],
//       description: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Women's - Upper Body - Arms & Sleeves",
//         },
//       ],
//     },
//     {
//       name: "womens_upper_body_arms_and_sleeves_arm_circumference_upper_bicep",
//       type: "float",
//       label: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Arm Circumference (Upper Bicep)",
//         },
//       ],
//       description: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Women's - Upper Body - Arms & Sleeves",
//         },
//       ],
//     },
//     {
//       name: "womens_upper_body_arms_and_sleeves_arm_circumference_mid_bicep",
//       type: "float",
//       label: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Arm Circumference (Mid-Bicep)",
//         },
//       ],
//       description: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Women's - Upper Body - Arms & Sleeves",
//         },
//       ],
//     },
//     {
//       name: "womens_upper_body_arms_and_sleeves_elbow_circumference",
//       type: "float",
//       label: [{ languageCode: LanguageCode.en, value: "Elbow Circumference" }],
//       description: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Women's - Upper Body - Arms & Sleeves",
//         },
//       ],
//     },
//     {
//       name: "womens_upper_body_arms_and_sleeves_forearm_circumference",
//       type: "float",
//       label: [
//         { languageCode: LanguageCode.en, value: "Forearm Circumference" },
//       ],
//       description: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Women's - Upper Body - Arms & Sleeves",
//         },
//       ],
//     },
//     {
//       name: "womens_upper_body_arms_and_sleeves_wrist_circumference",
//       type: "float",
//       label: [{ languageCode: LanguageCode.en, value: "Wrist Circumference" }],
//       description: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Women's - Upper Body - Arms & Sleeves",
//         },
//       ],
//     },
//     {
//       name: "womens_upper_body_torso_waist_waist_circumference_natural_waist",
//       type: "float",
//       label: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Waist Circumference (Natural Waist)",
//         },
//       ],
//       description: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Women's - Upper Body - Torso / Waist",
//         },
//       ],
//     },
//     {
//       name: "womens_upper_body_torso_waist_high_waist_circumference",
//       type: "float",
//       label: [
//         {
//           languageCode: LanguageCode.en,
//           value: "High Waist Circumference",
//         },
//       ],
//       description: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Women's - Upper Body - Torso / Waist",
//         },
//       ],
//     },
//     {
//       name: "womens_upper_body_torso_waist_low_waist_circumference",
//       type: "float",
//       label: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Low Waist Circumference",
//         },
//       ],
//       description: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Women's - Upper Body - Torso / Waist",
//         },
//       ],
//     },
//     {
//       name: "womens_upper_body_torso_waist_front_waist_length_neck_base_to_waist_cf",
//       type: "float",
//       label: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Front Waist Length (Neck Base to Waist, CF)",
//         },
//       ],
//       description: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Women's - Upper Body - Torso / Waist",
//         },
//       ],
//     },
//     {
//       name: "womens_upper_body_torso_waist_back_waist_length_neck_base_to_waist_cb",
//       type: "float",
//       label: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Back Waist Length (Neck Base to Waist, CB)",
//         },
//       ],
//       description: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Women's - Upper Body - Torso / Waist",
//         },
//       ],
//     },
//     {
//       name: "womens_upper_body_torso_waist_side_waist_length_underarm_to_waist",
//       type: "float",
//       label: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Side Waist Length (Underarm to Waist)",
//         },
//       ],
//       description: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Women's - Upper Body - Torso / Waist",
//         },
//       ],
//     },
//     {
//       name: "womens_upper_body_torso_waist_waist_to_bust_apex",
//       type: "float",
//       label: [{ languageCode: LanguageCode.en, value: "Waist to Bust Apex" }],
//       description: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Women's - Upper Body - Torso / Waist",
//         },
//       ],
//     },
//     {
//       name: "womens_upper_body_torso_waist_waist_to_shoulder_front",
//       type: "float",
//       label: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Waist to Shoulder (Front)",
//         },
//       ],
//       description: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Women's - Upper Body - Torso / Waist",
//         },
//       ],
//     },
//     {
//       name: "womens_upper_body_torso_waist_waist_to_shoulder_back",
//       type: "float",
//       label: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Waist to Shoulder (Back)",
//         },
//       ],
//       description: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Women's - Upper Body - Torso / Waist",
//         },
//       ],
//     },
//     {
//       name: "womens_lower_body_hips_and_seat_hip_circumference_fullest_point",
//       type: "float",
//       label: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Hip Circumference (Fullest Point)",
//         },
//       ],
//       description: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Women's - Lower Body - Hips & Seat",
//         },
//       ],
//     },
//     {
//       name: "womens_lower_body_hips_and_seat_high_hip_circumference",
//       type: "float",
//       label: [
//         {
//           languageCode: LanguageCode.en,
//           value: "High Hip Circumference",
//         },
//       ],
//       description: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Women's - Lower Body - Hips & Seat",
//         },
//       ],
//     },
//     {
//       name: "womens_lower_body_hips_and_seat_low_hip_circumference",
//       type: "float",
//       label: [
//         { languageCode: LanguageCode.en, value: "Low Hip Circumference" },
//       ],
//       description: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Women's - Lower Body - Hips & Seat",
//         },
//       ],
//     },
//     {
//       name: "womens_lower_body_hips_and_seat_hip_depth_waist_to_full_hip",
//       type: "float",
//       label: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Hip Depth (Waist to Full Hip)",
//         },
//       ],
//       description: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Women's - Lower Body - Hips & Seat",
//         },
//       ],
//     },
//     {
//       name: "womens_lower_body_hips_and_seat_abdomen_circumference",
//       type: "float",
//       label: [
//         { languageCode: LanguageCode.en, value: "Abdomen Circumference" },
//       ],
//       description: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Women's - Lower Body - Hips & Seat",
//         },
//       ],
//     },
//     {
//       name: "womens_lower_body_hips_and_seat_seat_circumference_buttocks_fullest_point",
//       type: "float",
//       label: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Seat Circumference (Buttocks Fullest Point)",
//         },
//       ],
//       description: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Women's - Lower Body - Hips & Seat",
//         },
//       ],
//     },
//     {
//       name: "womens_lower_body_hips_and_seat_waist_to_abdomen_depth",
//       type: "float",
//       label: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Waist to Abdomen Depth",
//         },
//       ],
//       description: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Women's - Lower Body - Hips & Seat",
//         },
//       ],
//     },
//     {
//       name: "womens_lower_body_hips_and_seat_waist_to_seat_depth",
//       type: "float",
//       label: [{ languageCode: LanguageCode.en, value: "Waist to Seat Depth" }],
//       description: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Women's - Lower Body - Hips & Seat",
//         },
//       ],
//     },
//     {
//       name: "womens_lower_body_legs_inseam_crotch_to_ankle",
//       type: "float",
//       label: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Inseam (Crotch to Ankle)",
//         },
//       ],
//       description: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Women's - Lower Body - Legs",
//         },
//       ],
//     },
//     {
//       name: "womens_lower_body_legs_outseam_waist_to_ankle",
//       type: "float",
//       label: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Outseam (Waist to Ankle)",
//         },
//       ],
//       description: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Women's - Lower Body - Legs",
//         },
//       ],
//     },
//     {
//       name: "womens_lower_body_legs_thigh_circumference_upper_thigh",
//       type: "float",
//       label: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Thigh Circumference (Upper Thigh)",
//         },
//       ],
//       description: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Women's - Lower Body - Legs",
//         },
//       ],
//     },
//     {
//       name: "womens_lower_body_legs_mid_thigh_circumference",
//       type: "float",
//       label: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Mid-Thigh Circumference",
//         },
//       ],
//       description: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Women's - Lower Body - Legs",
//         },
//       ],
//     },
//     {
//       name: "womens_lower_body_legs_knee_circumference",
//       type: "float",
//       label: [{ languageCode: LanguageCode.en, value: "Knee Circumference" }],
//       description: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Women's - Lower Body - Legs",
//         },
//       ],
//     },
//     {
//       name: "womens_lower_body_legs_knee_to_ankle_length",
//       type: "float",
//       label: [{ languageCode: LanguageCode.en, value: "Knee to Ankle Length" }],
//       description: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Women's - Lower Body - Legs",
//         },
//       ],
//     },
//     {
//       name: "womens_lower_body_legs_calf_circumference_fullest_point",
//       type: "float",
//       label: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Calf Circumference (Fullest Point)",
//         },
//       ],
//       description: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Women's - Lower Body - Legs",
//         },
//       ],
//     },
//     {
//       name: "womens_lower_body_legs_mid_calf_circumference",
//       type: "float",
//       label: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Mid-Calf Circumference",
//         },
//       ],
//       description: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Women's - Lower Body - Legs",
//         },
//       ],
//     },
//     {
//       name: "womens_lower_body_legs_ankle_circumference",
//       type: "float",
//       label: [{ languageCode: LanguageCode.en, value: "Ankle Circumference" }],
//       description: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Women's - Lower Body - Legs",
//         },
//       ],
//     },
//     {
//       name: "womens_lower_body_legs_waist_to_knee_length",
//       type: "float",
//       label: [{ languageCode: LanguageCode.en, value: "Waist to Knee Length" }],
//       description: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Women's - Lower Body - Legs",
//         },
//       ],
//     },
//     {
//       name: "womens_lower_body_legs_waist_to_floor_length",
//       type: "float",
//       label: [
//         { languageCode: LanguageCode.en, value: "Waist to Floor Length" },
//       ],
//       description: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Women's - Lower Body - Legs",
//         },
//       ],
//     },
//     {
//       name: "womens_lower_body_legs_crotch_depth_sitting_depth",
//       type: "float",
//       label: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Crotch Depth (Sitting Depth)",
//         },
//       ],
//       description: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Women's - Lower Body - Legs",
//         },
//       ],
//     },
//     {
//       name: "womens_lower_body_legs_front_rise",
//       type: "float",
//       label: [{ languageCode: LanguageCode.en, value: "Front Rise" }],
//       description: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Women's - Lower Body - Legs",
//         },
//       ],
//     },
//     {
//       name: "womens_lower_body_legs_back_rise",
//       type: "float",
//       label: [{ languageCode: LanguageCode.en, value: "Back Rise" }],
//       description: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Women's - Lower Body - Legs",
//         },
//       ],
//     },
//     {
//       name: "womens_other_height_and_proportions_total_height",
//       type: "float",
//       label: [{ languageCode: LanguageCode.en, value: "Total Height" }],
//       description: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Women's - Other - Height & Proportions",
//         },
//       ],
//     },
//     {
//       name: "womens_other_height_and_proportions_sitting_height",
//       type: "float",
//       label: [{ languageCode: LanguageCode.en, value: "Sitting Height" }],
//       description: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Women's - Other - Height & Proportions",
//         },
//       ],
//     },
//     {
//       name: "womens_other_height_and_proportions_torso_length_neck_to_hip",
//       type: "float",
//       label: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Torso Length (Neck to Hip)",
//         },
//       ],
//       description: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Women's - Other - Height & Proportions",
//         },
//       ],
//     },
//     {
//       name: "womens_other_height_and_proportions_crotch_length_front_waist_to_back_waist_through_crotch",
//       type: "float",
//       label: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Crotch Length (Front Waist to Back Waist through crotch)",
//         },
//       ],
//       description: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Women's - Other - Height & Proportions",
//         },
//       ],
//     },
//     {
//       name: "womens_other_height_and_proportions_girth_torso_loop",
//       type: "float",
//       label: [{ languageCode: LanguageCode.en, value: "Girth (Torso Loop)" }],
//       description: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Women's - Other - Height & Proportions",
//         },
//       ],
//     },
//     {
//       name: "womens_other_height_and_proportions_shoulder_to_floor",
//       type: "float",
//       label: [{ languageCode: LanguageCode.en, value: "Shoulder to Floor" }],
//       description: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Women's - Other - Height & Proportions",
//         },
//       ],
//     },
//     {
//       name: "womens_other_height_and_proportions_arm_span_fingertip_to_fingertip",
//       type: "float",
//       label: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Arm Span (Fingertip to Fingertip)",
//         },
//       ],
//       description: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Women's - Other - Height & Proportions",
//         },
//       ],
//     },
//     {
//       name: "womens_other_couture_specific_bust_radius_apex_to_underarm",
//       type: "float",
//       label: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Bust Radius (Apex to Underarm)",
//         },
//       ],
//       description: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Women's - Other - Couture-Specific",
//         },
//       ],
//     },
//     {
//       name: "womens_other_couture_specific_bust_radius_apex_to_cf",
//       type: "float",
//       label: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Bust Radius (Apex to CF)",
//         },
//       ],
//       description: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Women's - Other - Couture-Specific",
//         },
//       ],
//     },
//     {
//       name: "womens_other_couture_specific_bust_radius_apex_to_side_seam",
//       type: "float",
//       label: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Bust Radius (Apex to Side Seam)",
//         },
//       ],
//       description: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Women's - Other - Couture-Specific",
//         },
//       ],
//     },
//     {
//       name: "womens_other_couture_specific_princess_line_shoulder_to_bust_to_waist",
//       type: "float",
//       label: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Princess Line (Shoulder to Bust to Waist)",
//         },
//       ],
//       description: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Women's - Other - Couture-Specific",
//         },
//       ],
//     },
//     {
//       name: "womens_other_couture_specific_dart_placement_apex_to_waist",
//       type: "float",
//       label: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Dart Placement (Apex to Waist)",
//         },
//       ],
//       description: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Women's - Other - Couture-Specific",
//         },
//       ],
//     },
//     {
//       name: "womens_other_couture_specific_dart_placement_apex_to_hip",
//       type: "float",
//       label: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Dart Placement (Apex to Hip)",
//         },
//       ],
//       description: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Women's - Other - Couture-Specific",
//         },
//       ],
//     },
//     {
//       name: "womens_other_couture_specific_underbust_to_waist_length",
//       type: "float",
//       label: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Underbust to Waist Length",
//         },
//       ],
//       description: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Women's - Other - Couture-Specific",
//         },
//       ],
//     },
//     {
//       name: "womens_other_couture_specific_waist_to_hip_length",
//       type: "float",
//       label: [{ languageCode: LanguageCode.en, value: "Waist to Hip Length" }],
//       description: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Women's - Other - Couture-Specific",
//         },
//       ],
//     },
//     {
//       name: "womens_other_couture_specific_skirt_balance_front",
//       type: "float",
//       label: [
//         { languageCode: LanguageCode.en, value: "Skirt Balance (Front)" },
//       ],
//       description: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Women's - Other - Couture-Specific",
//         },
//       ],
//     },
//     {
//       name: "womens_other_couture_specific_skirt_balance_side",
//       type: "float",
//       label: [{ languageCode: LanguageCode.en, value: "Skirt Balance (Side)" }],
//       description: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Women's - Other - Couture-Specific",
//         },
//       ],
//     },
//     {
//       name: "womens_other_couture_specific_skirt_balance_back",
//       type: "float",
//       label: [{ languageCode: LanguageCode.en, value: "Skirt Balance (Back)" }],
//       description: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Women's - Other - Couture-Specific",
//         },
//       ],
//     },
//     {
//       name: "womens_other_couture_specific_train_length",
//       type: "float",
//       label: [{ languageCode: LanguageCode.en, value: "Train Length" }],
//       description: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Women's - Other - Couture-Specific",
//         },
//       ],
//     },
//     {
//       name: "womens_other_hand_and_foot_hand_length_wrist_to_middle_finger",
//       type: "float",
//       label: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Hand Length (Wrist to Middle Finger)",
//         },
//       ],
//       description: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Women's - Other - Hand & Foot",
//         },
//       ],
//     },
//     {
//       name: "womens_other_hand_and_foot_palm_circumference",
//       type: "float",
//       label: [{ languageCode: LanguageCode.en, value: "Palm Circumference" }],
//       description: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Women's - Other - Hand & Foot",
//         },
//       ],
//     },
//     {
//       name: "womens_other_hand_and_foot_finger_lengths",
//       type: "text",
//       label: [{ languageCode: LanguageCode.en, value: "Finger Lengths" }],
//       description: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Women's - Other - Hand & Foot",
//         },
//       ],
//     },
//     {
//       name: "womens_other_hand_and_foot_foot_length",
//       type: "float",
//       label: [{ languageCode: LanguageCode.en, value: "Foot Length" }],
//       description: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Women's - Other - Hand & Foot",
//         },
//       ],
//     },
//     {
//       name: "womens_other_hand_and_foot_foot_width_ball_and_instep",
//       type: "float",
//       label: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Foot Width (Ball & Instep)",
//         },
//       ],
//       description: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Women's - Other - Hand & Foot",
//         },
//       ],
//     },
//     {
//       name: "womens_other_hand_and_foot_ankle_to_heel_height",
//       type: "float",
//       label: [{ languageCode: LanguageCode.en, value: "Ankle to Heel Height" }],
//       description: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Women's - Other - Hand & Foot",
//         },
//       ],
//     },
//     // Men's Body Measurements
//     {
//       name: "mens_upper_body_head_and_neck_head_circumference",
//       type: "float",
//       label: [{ languageCode: LanguageCode.en, value: "Head Circumference" }],
//       description: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Men's - Upper Body - Head & Neck",
//         },
//       ],
//     },
//     {
//       name: "mens_upper_body_head_and_neck_neck_circumference_base_of_neck",
//       type: "float",
//       label: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Neck Circumference (Base of Neck)",
//         },
//       ],
//       description: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Men's - Upper Body - Head & Neck",
//         },
//       ],
//     },
//     {
//       name: "mens_upper_body_head_and_neck_neck_height_front",
//       type: "float",
//       label: [{ languageCode: LanguageCode.en, value: "Neck Height (Front)" }],
//       description: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Men's - Upper Body - Head & Neck",
//         },
//       ],
//     },
//     {
//       name: "mens_upper_body_head_and_neck_neck_height_back",
//       type: "float",
//       label: [{ languageCode: LanguageCode.en, value: "Neck Height (Back)" }],
//       description: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Men's - Upper Body - Head & Neck",
//         },
//       ],
//     },
//     {
//       name: "mens_upper_body_head_and_neck_collar_circumference",
//       type: "float",
//       label: [{ languageCode: LanguageCode.en, value: "Collar Circumference" }],
//       description: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Men's - Upper Body - Head & Neck",
//         },
//       ],
//     },
//     {
//       name: "mens_upper_body_shoulders_and_chest_shoulder_width_point_to_point",
//       type: "float",
//       label: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Shoulder Width (Point-to-Point)",
//         },
//       ],
//       description: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Men's - Upper Body - Shoulders & Chest",
//         },
//       ],
//     },
//     {
//       name: "mens_upper_body_shoulders_and_chest_shoulder_slope_left",
//       type: "float",
//       label: [
//         { languageCode: LanguageCode.en, value: "Shoulder Slope (Left)" },
//       ],
//       description: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Men's - Upper Body - Shoulders & Chest",
//         },
//       ],
//     },
//     {
//       name: "mens_upper_body_shoulders_and_chest_shoulder_slope_right",
//       type: "float",
//       label: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Shoulder Slope (Right)",
//         },
//       ],
//       description: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Men's - Upper Body - Shoulders & Chest",
//         },
//       ],
//     },
//     {
//       name: "mens_upper_body_shoulders_and_chest_across_chest_front_armhole_level",
//       type: "float",
//       label: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Across Chest (Front, Armhole Level)",
//         },
//       ],
//       description: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Men's - Upper Body - Shoulders & Chest",
//         },
//       ],
//     },
//     {
//       name: "mens_upper_body_shoulders_and_chest_across_back_back_width_at_armhole_level",
//       type: "float",
//       label: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Across Back (Back Width at Armhole Level)",
//         },
//       ],
//       description: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Men's - Upper Body - Shoulders & Chest",
//         },
//       ],
//     },
//     {
//       name: "mens_upper_body_shoulders_and_chest_chest_circumference_full_chest_at_nipples",
//       type: "float",
//       label: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Chest Circumference (Full Chest at Nipples)",
//         },
//       ],
//       description: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Men's - Upper Body - Shoulders & Chest",
//         },
//       ],
//     },
//     {
//       name: "mens_upper_body_shoulders_and_chest_upper_chest_circumference_underarm",
//       type: "float",
//       label: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Upper Chest Circumference (Underarm)",
//         },
//       ],
//       description: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Men's - Upper Body - Shoulders & Chest",
//         },
//       ],
//     },
//     {
//       name: "mens_upper_body_shoulders_and_chest_under_chest_ribcage_circumference",
//       type: "float",
//       label: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Under-Chest / Ribcage Circumference",
//         },
//       ],
//       description: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Men's - Upper Body - Shoulders & Chest",
//         },
//       ],
//     },
//     {
//       name: "mens_upper_body_shoulders_and_chest_chest_depth_front_to_back",
//       type: "float",
//       label: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Chest Depth (Front-to-Back)",
//         },
//       ],
//       description: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Men's - Upper Body - Shoulders & Chest",
//         },
//       ],
//     },
//     {
//       name: "mens_upper_body_shoulders_and_chest_chest_width_side_to_side",
//       type: "float",
//       label: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Chest Width (Side-to-Side)",
//         },
//       ],
//       description: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Men's - Upper Body - Shoulders & Chest",
//         },
//       ],
//     },
//     {
//       name: "mens_upper_body_shoulders_and_chest_shoulder_to_waist_length_front",
//       type: "float",
//       label: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Shoulder to Waist Length (Front)",
//         },
//       ],
//       description: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Men's - Upper Body - Shoulders & Chest",
//         },
//       ],
//     },
//     {
//       name: "mens_upper_body_shoulders_and_chest_shoulder_to_waist_length_back",
//       type: "float",
//       label: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Shoulder to Waist Length (Back)",
//         },
//       ],
//       description: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Men's - Upper Body - Shoulders & Chest",
//         },
//       ],
//     },
//     {
//       name: "mens_upper_body_shoulders_and_chest_scye_depth_front",
//       type: "float",
//       label: [{ languageCode: LanguageCode.en, value: "Scye Depth (Front)" }],
//       description: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Men's - Upper Body - Shoulders & Chest",
//         },
//       ],
//     },
//     {
//       name: "mens_upper_body_shoulders_and_chest_scye_depth_back",
//       type: "float",
//       label: [{ languageCode: LanguageCode.en, value: "Scye Depth (Back)" }],
//       description: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Men's - Upper Body - Shoulders & Chest",
//         },
//       ],
//     },
//     {
//       name: "mens_upper_body_arms_and_sleeves_arm_length_shoulder_to_wrist",
//       type: "float",
//       label: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Arm Length (Shoulder to Wrist)",
//         },
//       ],
//       description: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Men's - Upper Body - Arms & Sleeves",
//         },
//       ],
//     },
//     {
//       name: "mens_upper_body_arms_and_sleeves_arm_length_shoulder_to_elbow",
//       type: "float",
//       label: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Arm Length (Shoulder to Elbow)",
//         },
//       ],
//       description: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Men's - Upper Body - Arms & Sleeves",
//         },
//       ],
//     },
//     {
//       name: "mens_upper_body_arms_and_sleeves_overarm_length_bent_elbow",
//       type: "float",
//       label: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Overarm Length (Bent Elbow)",
//         },
//       ],
//       description: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Men's - Upper Body - Arms & Sleeves",
//         },
//       ],
//     },
//     {
//       name: "mens_upper_body_arms_and_sleeves_underarm_length_armpit_to_wrist",
//       type: "float",
//       label: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Underarm Length (Armpit to Wrist)",
//         },
//       ],
//       description: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Men's - Upper Body - Arms & Sleeves",
//         },
//       ],
//     },
//     {
//       name: "mens_upper_body_arms_and_sleeves_bicep_circumference",
//       type: "float",
//       label: [{ languageCode: LanguageCode.en, value: "Bicep Circumference" }],
//       description: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Men's - Upper Body - Arms & Sleeves",
//         },
//       ],
//     },
//     {
//       name: "mens_upper_body_arms_and_sleeves_mid_bicep_circumference",
//       type: "float",
//       label: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Mid-Bicep Circumference",
//         },
//       ],
//       description: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Men's - Upper Body - Arms & Sleeves",
//         },
//       ],
//     },
//     {
//       name: "mens_upper_body_arms_and_sleeves_elbow_circumference",
//       type: "float",
//       label: [{ languageCode: LanguageCode.en, value: "Elbow Circumference" }],
//       description: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Men's - Upper Body - Arms & Sleeves",
//         },
//       ],
//     },
//     {
//       name: "mens_upper_body_arms_and_sleeves_forearm_circumference",
//       type: "float",
//       label: [
//         { languageCode: LanguageCode.en, value: "Forearm Circumference" },
//       ],
//       description: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Men's - Upper Body - Arms & Sleeves",
//         },
//       ],
//     },
//     {
//       name: "mens_upper_body_arms_and_sleeves_wrist_circumference",
//       type: "float",
//       label: [{ languageCode: LanguageCode.en, value: "Wrist Circumference" }],
//       description: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Men's - Upper Body - Arms & Sleeves",
//         },
//       ],
//     },
//     {
//       name: "mens_upper_body_arms_and_sleeves_armhole_circumference",
//       type: "float",
//       label: [
//         { languageCode: LanguageCode.en, value: "Armhole Circumference" },
//       ],
//       description: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Men's - Upper Body - Arms & Sleeves",
//         },
//       ],
//     },
//     {
//       name: "mens_upper_body_torso_waist_waist_circumference_natural_waist",
//       type: "float",
//       label: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Waist Circumference (Natural Waist)",
//         },
//       ],
//       description: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Men's - Upper Body - Torso / Waist",
//         },
//       ],
//     },
//     {
//       name: "mens_upper_body_torso_waist_high_waist_circumference",
//       type: "float",
//       label: [
//         {
//           languageCode: LanguageCode.en,
//           value: "High Waist Circumference",
//         },
//       ],
//       description: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Men's - Upper Body - Torso / Waist",
//         },
//       ],
//     },
//     {
//       name: "mens_upper_body_torso_waist_low_waist_circumference",
//       type: "float",
//       label: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Low Waist Circumference",
//         },
//       ],
//       description: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Men's - Upper Body - Torso / Waist",
//         },
//       ],
//     },
//     {
//       name: "mens_upper_body_torso_waist_front_waist_length_neck_base_to_waist_cf",
//       type: "float",
//       label: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Front Waist Length (Neck Base to Waist, CF)",
//         },
//       ],
//       description: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Men's - Upper Body - Torso / Waist",
//         },
//       ],
//     },
//     {
//       name: "mens_upper_body_torso_waist_back_waist_length_neck_base_to_waist_cb",
//       type: "float",
//       label: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Back Waist Length (Neck Base to Waist, CB)",
//         },
//       ],
//       description: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Men's - Upper Body - Torso / Waist",
//         },
//       ],
//     },
//     {
//       name: "mens_upper_body_torso_waist_side_waist_length_underarm_to_waist",
//       type: "float",
//       label: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Side Waist Length (Underarm to Waist)",
//         },
//       ],
//       description: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Men's - Upper Body - Torso / Waist",
//         },
//       ],
//     },
//     {
//       name: "mens_upper_body_torso_waist_shoulder_to_hip_length",
//       type: "float",
//       label: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Shoulder to Hip Length",
//         },
//       ],
//       description: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Men's - Upper Body - Torso / Waist",
//         },
//       ],
//     },
//     {
//       name: "mens_upper_body_torso_waist_chest_to_waist_length_front",
//       type: "float",
//       label: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Chest to Waist Length (Front)",
//         },
//       ],
//       description: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Men's - Upper Body - Torso / Waist",
//         },
//       ],
//     },
//     {
//       name: "mens_lower_body_hips_and_seat_hip_circumference_fullest_point",
//       type: "float",
//       label: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Hip Circumference (Fullest Point)",
//         },
//       ],
//       description: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Men's - Lower Body - Hips & Seat",
//         },
//       ],
//     },
//     {
//       name: "mens_lower_body_hips_and_seat_high_hip_circumference",
//       type: "float",
//       label: [
//         {
//           languageCode: LanguageCode.en,
//           value: "High Hip Circumference",
//         },
//       ],
//       description: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Men's - Lower Body - Hips & Seat",
//         },
//       ],
//     },
//     {
//       name: "mens_lower_body_hips_and_seat_low_hip_circumference",
//       type: "float",
//       label: [
//         { languageCode: LanguageCode.en, value: "Low Hip Circumference" },
//       ],
//       description: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Men's - Lower Body - Hips & Seat",
//         },
//       ],
//     },
//     {
//       name: "mens_lower_body_hips_and_seat_abdomen_circumference",
//       type: "float",
//       label: [
//         { languageCode: LanguageCode.en, value: "Abdomen Circumference" },
//       ],
//       description: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Men's - Lower Body - Hips & Seat",
//         },
//       ],
//     },
//     {
//       name: "mens_lower_body_hips_and_seat_seat_circumference_buttocks_fullest_point",
//       type: "float",
//       label: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Seat Circumference (Buttocks Fullest Point)",
//         },
//       ],
//       description: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Men's - Lower Body - Hips & Seat",
//         },
//       ],
//     },
//     {
//       name: "mens_lower_body_hips_and_seat_waist_to_hip_depth",
//       type: "float",
//       label: [{ languageCode: LanguageCode.en, value: "Waist to Hip Depth" }],
//       description: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Men's - Lower Body - Hips & Seat",
//         },
//       ],
//     },
//     {
//       name: "mens_lower_body_hips_and_seat_waist_to_seat_depth",
//       type: "float",
//       label: [{ languageCode: LanguageCode.en, value: "Waist to Seat Depth" }],
//       description: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Men's - Lower Body - Hips & Seat",
//         },
//       ],
//     },
//     {
//       name: "mens_lower_body_legs_inseam_crotch_to_ankle",
//       type: "float",
//       label: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Inseam (Crotch to Ankle)",
//         },
//       ],
//       description: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Men's - Lower Body - Legs",
//         },
//       ],
//     },
//     {
//       name: "mens_lower_body_legs_outseam_waist_to_ankle",
//       type: "float",
//       label: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Outseam (Waist to Ankle)",
//         },
//       ],
//       description: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Men's - Lower Body - Legs",
//         },
//       ],
//     },
//     {
//       name: "mens_lower_body_legs_front_rise",
//       type: "float",
//       label: [{ languageCode: LanguageCode.en, value: "Front Rise" }],
//       description: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Men's - Lower Body - Legs",
//         },
//       ],
//     },
//     {
//       name: "mens_lower_body_legs_back_rise",
//       type: "float",
//       label: [{ languageCode: LanguageCode.en, value: "Back Rise" }],
//       description: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Men's - Lower Body - Legs",
//         },
//       ],
//     },
//     {
//       name: "mens_lower_body_legs_crotch_depth_sitting_depth",
//       type: "float",
//       label: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Crotch Depth (Sitting Depth)",
//         },
//       ],
//       description: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Men's - Lower Body - Legs",
//         },
//       ],
//     },
//     {
//       name: "mens_lower_body_legs_crotch_length_front_waist_to_back_waist_through_crotch",
//       type: "float",
//       label: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Crotch Length (Front Waist to Back Waist through crotch)",
//         },
//       ],
//       description: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Men's - Lower Body - Legs",
//         },
//       ],
//     },
//     {
//       name: "mens_lower_body_legs_thigh_circumference_upper_thigh",
//       type: "float",
//       label: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Thigh Circumference (Upper Thigh)",
//         },
//       ],
//       description: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Men's - Lower Body - Legs",
//         },
//       ],
//     },
//     {
//       name: "mens_lower_body_legs_mid_thigh_circumference",
//       type: "float",
//       label: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Mid-Thigh Circumference",
//         },
//       ],
//       description: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Men's - Lower Body - Legs",
//         },
//       ],
//     },
//     {
//       name: "mens_lower_body_legs_knee_circumference",
//       type: "float",
//       label: [{ languageCode: LanguageCode.en, value: "Knee Circumference" }],
//       description: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Men's - Lower Body - Legs",
//         },
//       ],
//     },
//     {
//       name: "mens_lower_body_legs_knee_to_ankle_length",
//       type: "float",
//       label: [{ languageCode: LanguageCode.en, value: "Knee to Ankle Length" }],
//       description: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Men's - Lower Body - Legs",
//         },
//       ],
//     },
//     {
//       name: "mens_lower_body_legs_calf_circumference",
//       type: "float",
//       label: [{ languageCode: LanguageCode.en, value: "Calf Circumference" }],
//       description: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Men's - Lower Body - Legs",
//         },
//       ],
//     },
//     {
//       name: "mens_lower_body_legs_mid_calf_circumference",
//       type: "float",
//       label: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Mid-Calf Circumference",
//         },
//       ],
//       description: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Men's - Lower Body - Legs",
//         },
//       ],
//     },
//     {
//       name: "mens_lower_body_legs_ankle_circumference",
//       type: "float",
//       label: [{ languageCode: LanguageCode.en, value: "Ankle Circumference" }],
//       description: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Men's - Lower Body - Legs",
//         },
//       ],
//     },
//     {
//       name: "mens_lower_body_legs_waist_to_knee_length",
//       type: "float",
//       label: [{ languageCode: LanguageCode.en, value: "Waist to Knee Length" }],
//       description: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Men's - Lower Body - Legs",
//         },
//       ],
//     },
//     {
//       name: "mens_lower_body_legs_waist_to_floor_length",
//       type: "float",
//       label: [
//         { languageCode: LanguageCode.en, value: "Waist to Floor Length" },
//       ],
//       description: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Men's - Lower Body - Legs",
//         },
//       ],
//     },
//     {
//       name: "mens_other_height_and_balance_total_height",
//       type: "float",
//       label: [{ languageCode: LanguageCode.en, value: "Total Height" }],
//       description: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Men's - Other - Height & Balance",
//         },
//       ],
//     },
//     {
//       name: "mens_other_height_and_balance_sitting_height",
//       type: "float",
//       label: [{ languageCode: LanguageCode.en, value: "Sitting Height" }],
//       description: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Men's - Other - Height & Balance",
//         },
//       ],
//     },
//     {
//       name: "mens_other_height_and_balance_torso_length_neck_to_hip",
//       type: "float",
//       label: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Torso Length (Neck to Hip)",
//         },
//       ],
//       description: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Men's - Other - Height & Balance",
//         },
//       ],
//     },
//     {
//       name: "mens_other_height_and_balance_shoulder_to_floor",
//       type: "float",
//       label: [{ languageCode: LanguageCode.en, value: "Shoulder to Floor" }],
//       description: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Men's - Other - Height & Balance",
//         },
//       ],
//     },
//     {
//       name: "mens_other_height_and_balance_arm_span_fingertip_to_fingertip",
//       type: "float",
//       label: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Arm Span (Fingertip to Fingertip)",
//         },
//       ],
//       description: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Men's - Other - Height & Balance",
//         },
//       ],
//     },
//     {
//       name: "mens_other_height_and_balance_shoulder_to_wrist_balance",
//       type: "float",
//       label: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Shoulder to Wrist Balance",
//         },
//       ],
//       description: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Men's - Other - Height & Balance",
//         },
//       ],
//     },
//     {
//       name: "mens_other_height_and_balance_side_balance_waist_to_floor_left_vs_right",
//       type: "float",
//       label: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Side Balance (Waist to Floor — Left vs Right)",
//         },
//       ],
//       description: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Men's - Other - Height & Balance",
//         },
//       ],
//     },
//     {
//       name: "mens_other_tailoring_specific_overarm_circumference_chest_plus_arms_around",
//       type: "float",
//       label: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Overarm Circumference (Chest + Arms around)",
//         },
//       ],
//       description: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Men's - Other - Tailoring-Specific",
//         },
//       ],
//     },
//     {
//       name: "mens_other_tailoring_specific_stomach_drop_chest_minus_waist_difference",
//       type: "float",
//       label: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Stomach Drop (Chest minus Waist Difference)",
//         },
//       ],
//       description: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Men's - Other - Tailoring-Specific",
//         },
//       ],
//     },
//     {
//       name: "mens_other_tailoring_specific_hip_drop_waist_minus_hip_difference",
//       type: "float",
//       label: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Hip Drop (Waist minus Hip Difference)",
//         },
//       ],
//       description: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Men's - Other - Tailoring-Specific",
//         },
//       ],
//     },
//     {
//       name: "mens_other_tailoring_specific_coat_length_neck_base_to_hem",
//       type: "float",
//       label: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Coat Length (Neck Base to Hem)",
//         },
//       ],
//       description: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Men's - Other - Tailoring-Specific",
//         },
//       ],
//     },
//     {
//       name: "mens_other_tailoring_specific_jacket_balance_front_vs_back_length",
//       type: "float",
//       label: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Jacket Balance (Front vs Back Length)",
//         },
//       ],
//       description: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Men's - Other - Tailoring-Specific",
//         },
//       ],
//     },
//     {
//       name: "mens_other_tailoring_specific_waistcoat_length_neck_base_to_hem",
//       type: "float",
//       label: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Waistcoat Length (Neck Base to Hem)",
//         },
//       ],
//       description: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Men's - Other - Tailoring-Specific",
//         },
//       ],
//     },
//     {
//       name: "mens_other_tailoring_specific_skirt_balance_sherwani_kurta_front",
//       type: "float",
//       label: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Skirt Balance (Sherwani/Kurta Front)",
//         },
//       ],
//       description: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Men's - Other - Tailoring-Specific",
//         },
//       ],
//     },
//     {
//       name: "mens_other_tailoring_specific_skirt_balance_sherwani_kurta_side",
//       type: "float",
//       label: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Skirt Balance (Sherwani/Kurta Side)",
//         },
//       ],
//       description: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Men's - Other - Tailoring-Specific",
//         },
//       ],
//     },
//     {
//       name: "mens_other_tailoring_specific_skirt_balance_sherwani_kurta_back",
//       type: "float",
//       label: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Skirt Balance (Sherwani/Kurta Back)",
//         },
//       ],
//       description: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Men's - Other - Tailoring-Specific",
//         },
//       ],
//     },
//     {
//       name: "mens_other_tailoring_specific_train_length_ceremonial",
//       type: "float",
//       label: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Train Length (Ceremonial)",
//         },
//       ],
//       description: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Men's - Other - Tailoring-Specific",
//         },
//       ],
//     },
//     {
//       name: "mens_other_hand_and_foot_hand_length_wrist_to_middle_finger",
//       type: "float",
//       label: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Hand Length (Wrist to Middle Finger)",
//         },
//       ],
//       description: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Men's - Other - Hand & Foot",
//         },
//       ],
//     },
//     {
//       name: "mens_other_hand_and_foot_palm_circumference",
//       type: "float",
//       label: [{ languageCode: LanguageCode.en, value: "Palm Circumference" }],
//       description: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Men's - Other - Hand & Foot",
//         },
//       ],
//     },
//     {
//       name: "mens_other_hand_and_foot_finger_lengths",
//       type: "text",
//       label: [{ languageCode: LanguageCode.en, value: "Finger Lengths" }],
//       description: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Men's - Other - Hand & Foot",
//         },
//       ],
//     },
//     {
//       name: "mens_other_hand_and_foot_foot_length",
//       type: "float",
//       label: [{ languageCode: LanguageCode.en, value: "Foot Length" }],
//       description: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Men's - Other - Hand & Foot",
//         },
//       ],
//     },
//     {
//       name: "mens_other_hand_and_foot_foot_width_ball_and_instep",
//       type: "float",
//       label: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Foot Width (Ball & Instep)",
//         },
//       ],
//       description: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Men's - Other - Hand & Foot",
//         },
//       ],
//     },
//     {
//       name: "mens_other_hand_and_foot_ankle_to_heel_height",
//       type: "float",
//       label: [{ languageCode: LanguageCode.en, value: "Ankle to Heel Height" }],
//       description: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Men's - Other - Hand & Foot",
//         },
//       ],
//     },
//     // Shoes Measurements
//     {
//       name: "shoes_feet_and_toes_foot_length_heel_to_longest_toe",
//       type: "float",
//       label: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Foot Length (Heel to Longest Toe)",
//         },
//       ],
//       description: [
//         { languageCode: LanguageCode.en, value: "Shoes - Feet & Toes" },
//       ],
//     },
//     {
//       name: "shoes_feet_and_toes_ball_length_heel_to_ball_of_foot",
//       type: "float",
//       label: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Ball Length (Heel to Ball of Foot)",
//         },
//       ],
//       description: [
//         { languageCode: LanguageCode.en, value: "Shoes - Feet & Toes" },
//       ],
//     },
//     {
//       name: "shoes_feet_and_toes_joint_length_heel_to_1st_mtp_joint",
//       type: "float",
//       label: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Joint Length (Heel to 1st MTP Joint)",
//         },
//       ],
//       description: [
//         { languageCode: LanguageCode.en, value: "Shoes - Feet & Toes" },
//       ],
//     },
//     {
//       name: "shoes_feet_and_toes_short_heel_length_heel_to_instep_joint",
//       type: "float",
//       label: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Short Heel Length (Heel to Instep Joint)",
//         },
//       ],
//       description: [
//         { languageCode: LanguageCode.en, value: "Shoes - Feet & Toes" },
//       ],
//     },
//     {
//       name: "shoes_feet_and_toes_toe_length_big_toe",
//       type: "float",
//       label: [{ languageCode: LanguageCode.en, value: "Toe Length — Big Toe" }],
//       description: [
//         { languageCode: LanguageCode.en, value: "Shoes - Feet & Toes" },
//       ],
//     },
//     {
//       name: "shoes_feet_and_toes_toe_length_second_toe",
//       type: "float",
//       label: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Toe Length — Second Toe",
//         },
//       ],
//       description: [
//         { languageCode: LanguageCode.en, value: "Shoes - Feet & Toes" },
//       ],
//     },
//     {
//       name: "shoes_feet_and_toes_toe_length_third_toe",
//       type: "float",
//       label: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Toe Length — Third Toe",
//         },
//       ],
//       description: [
//         { languageCode: LanguageCode.en, value: "Shoes - Feet & Toes" },
//       ],
//     },
//     {
//       name: "shoes_feet_and_toes_toe_length_fourth_toe",
//       type: "float",
//       label: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Toe Length — Fourth Toe",
//         },
//       ],
//       description: [
//         { languageCode: LanguageCode.en, value: "Shoes - Feet & Toes" },
//       ],
//     },
//     {
//       name: "shoes_feet_and_toes_toe_length_fifth_toe",
//       type: "float",
//       label: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Toe Length — Fifth Toe",
//         },
//       ],
//       description: [
//         { languageCode: LanguageCode.en, value: "Shoes - Feet & Toes" },
//       ],
//     },
//     {
//       name: "shoes_feet_and_toes_toe_box_width_across_toes",
//       type: "float",
//       label: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Toe Box Width (Across Toes)",
//         },
//       ],
//       description: [
//         { languageCode: LanguageCode.en, value: "Shoes - Feet & Toes" },
//       ],
//     },
//     {
//       name: "shoes_feet_and_toes_toe_box_depth_vertical_height",
//       type: "float",
//       label: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Toe Box Depth (Vertical Height)",
//         },
//       ],
//       description: [
//         { languageCode: LanguageCode.en, value: "Shoes - Feet & Toes" },
//       ],
//     },
//     {
//       name: "shoes_feet_and_toes_toe_angle_straight_angled",
//       type: "string",
//       label: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Toe Angle (Straight/Angled)",
//         },
//       ],
//       description: [
//         { languageCode: LanguageCode.en, value: "Shoes - Feet & Toes" },
//       ],
//     },
//     {
//       name: "shoes_feet_and_toes_hallux_angle_big_toe_bunion_angle",
//       type: "float",
//       label: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Hallux Angle (Big Toe / Bunion Angle)",
//         },
//       ],
//       description: [
//         { languageCode: LanguageCode.en, value: "Shoes - Feet & Toes" },
//       ],
//     },
//     {
//       name: "shoes_feet_and_toes_toe_splay_spread_under_load",
//       type: "float",
//       label: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Toe Splay (Spread under Load)",
//         },
//       ],
//       description: [
//         { languageCode: LanguageCode.en, value: "Shoes - Feet & Toes" },
//       ],
//     },
//     {
//       name: "shoes_ball_and_forefoot_ball_girth_circumference",
//       type: "float",
//       label: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Ball Girth (Circumference)",
//         },
//       ],
//       description: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Shoes - Ball & Forefoot",
//         },
//       ],
//     },
//     {
//       name: "shoes_ball_and_forefoot_ball_width_side_to_side",
//       type: "float",
//       label: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Ball Width (Side-to-Side)",
//         },
//       ],
//       description: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Shoes - Ball & Forefoot",
//         },
//       ],
//     },
//     {
//       name: "shoes_ball_and_forefoot_joint_girth_1st_mtp_circumference",
//       type: "float",
//       label: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Joint Girth (1st MTP Circumference)",
//         },
//       ],
//       description: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Shoes - Ball & Forefoot",
//         },
//       ],
//     },
//     {
//       name: "shoes_ball_and_forefoot_waist_girth_mid_foot_narrowest",
//       type: "float",
//       label: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Waist Girth (Mid-Foot Narrowest)",
//         },
//       ],
//       description: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Shoes - Ball & Forefoot",
//         },
//       ],
//     },
//     {
//       name: "shoes_ball_and_forefoot_forefoot_width_widest_point",
//       type: "float",
//       label: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Forefoot Width (Widest Point)",
//         },
//       ],
//       description: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Shoes - Ball & Forefoot",
//         },
//       ],
//     },
//     {
//       name: "shoes_ball_and_forefoot_forefoot_depth_vertical_thickness",
//       type: "float",
//       label: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Forefoot Depth (Vertical Thickness)",
//         },
//       ],
//       description: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Shoes - Ball & Forefoot",
//         },
//       ],
//     },
//     {
//       name: "shoes_arch_and_instep_instep_girth_circumference",
//       type: "float",
//       label: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Instep Girth (Circumference)",
//         },
//       ],
//       description: [
//         { languageCode: LanguageCode.en, value: "Shoes - Arch & Instep" },
//       ],
//     },
//     {
//       name: "shoes_arch_and_instep_instep_height_vertical_from_ground",
//       type: "float",
//       label: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Instep Height (Vertical from Ground)",
//         },
//       ],
//       description: [
//         { languageCode: LanguageCode.en, value: "Shoes - Arch & Instep" },
//       ],
//     },
//     {
//       name: "shoes_arch_and_instep_long_heel_girth_instep_to_heel",
//       type: "float",
//       label: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Long Heel Girth (Instep to Heel)",
//         },
//       ],
//       description: [
//         { languageCode: LanguageCode.en, value: "Shoes - Arch & Instep" },
//       ],
//     },
//     {
//       name: "shoes_arch_and_instep_arch_length_heel_to_1st_metatarsal",
//       type: "float",
//       label: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Arch Length (Heel to 1st Metatarsal)",
//         },
//       ],
//       description: [
//         { languageCode: LanguageCode.en, value: "Shoes - Arch & Instep" },
//       ],
//     },
//     {
//       name: "shoes_arch_and_instep_arch_height_floor_to_navicular",
//       type: "float",
//       label: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Arch Height (Floor to Navicular)",
//         },
//       ],
//       description: [
//         { languageCode: LanguageCode.en, value: "Shoes - Arch & Instep" },
//       ],
//     },
//     {
//       name: "shoes_arch_and_instep_arch_circumference_around_midfoot",
//       type: "float",
//       label: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Arch Circumference (Around Midfoot)",
//         },
//       ],
//       description: [
//         { languageCode: LanguageCode.en, value: "Shoes - Arch & Instep" },
//       ],
//     },
//     {
//       name: "shoes_heel_and_ankle_heel_width_medial_to_lateral",
//       type: "float",
//       label: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Heel Width (Medial to Lateral)",
//         },
//       ],
//       description: [
//         { languageCode: LanguageCode.en, value: "Shoes - Heel & Ankle" },
//       ],
//     },
//     {
//       name: "shoes_heel_and_ankle_heel_height_base_to_ankle_bone",
//       type: "float",
//       label: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Heel Height (Base to Ankle Bone)",
//         },
//       ],
//       description: [
//         { languageCode: LanguageCode.en, value: "Shoes - Heel & Ankle" },
//       ],
//     },
//     {
//       name: "shoes_heel_and_ankle_heel_girth_circumference_around_heel_ankle",
//       type: "float",
//       label: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Heel Girth (Circumference around Heel/Ankle)",
//         },
//       ],
//       description: [
//         { languageCode: LanguageCode.en, value: "Shoes - Heel & Ankle" },
//       ],
//     },
//     {
//       name: "shoes_heel_and_ankle_ankle_girth_around_ankle_bone",
//       type: "float",
//       label: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Ankle Girth (Around Ankle Bone)",
//         },
//       ],
//       description: [
//         { languageCode: LanguageCode.en, value: "Shoes - Heel & Ankle" },
//       ],
//     },
//     {
//       name: "shoes_heel_and_ankle_ankle_height_floor_to_ankle_bone",
//       type: "float",
//       label: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Ankle Height (Floor to Ankle Bone)",
//         },
//       ],
//       description: [
//         { languageCode: LanguageCode.en, value: "Shoes - Heel & Ankle" },
//       ],
//     },
//     {
//       name: "shoes_heel_and_ankle_short_heel_girth_heel_to_instep",
//       type: "float",
//       label: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Short Heel Girth (Heel to Instep)",
//         },
//       ],
//       description: [
//         { languageCode: LanguageCode.en, value: "Shoes - Heel & Ankle" },
//       ],
//     },
//     {
//       name: "shoes_heel_and_ankle_heel_pitch_angle_heel_to_ball_drop",
//       type: "float",
//       label: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Heel Pitch Angle (Heel to Ball Drop)",
//         },
//       ],
//       description: [
//         { languageCode: LanguageCode.en, value: "Shoes - Heel & Ankle" },
//       ],
//     },
//     {
//       name: "shoes_calf_and_leg_calf_circumference_fullest",
//       type: "float",
//       label: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Calf Circumference (Fullest)",
//         },
//       ],
//       description: [
//         { languageCode: LanguageCode.en, value: "Shoes - Calf & Leg" },
//       ],
//     },
//     {
//       name: "shoes_calf_and_leg_mid_calf_circumference",
//       type: "float",
//       label: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Mid-Calf Circumference",
//         },
//       ],
//       description: [
//         { languageCode: LanguageCode.en, value: "Shoes - Calf & Leg" },
//       ],
//     },
//     {
//       name: "shoes_calf_and_leg_calf_height_floor_to_fullest_point",
//       type: "float",
//       label: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Calf Height (Floor to Fullest Point)",
//         },
//       ],
//       description: [
//         { languageCode: LanguageCode.en, value: "Shoes - Calf & Leg" },
//       ],
//     },
//     {
//       name: "shoes_calf_and_leg_knee_height_floor_to_knee",
//       type: "float",
//       label: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Knee Height (Floor to Knee)",
//         },
//       ],
//       description: [
//         { languageCode: LanguageCode.en, value: "Shoes - Calf & Leg" },
//       ],
//     },
//     {
//       name: "shoes_calf_and_leg_thigh_circumference_for_boots",
//       type: "float",
//       label: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Thigh Circumference (For Boots)",
//         },
//       ],
//       description: [
//         { languageCode: LanguageCode.en, value: "Shoes - Calf & Leg" },
//       ],
//     },
//     {
//       name: "shoes_calf_and_leg_thigh_height_floor_to_thigh",
//       type: "float",
//       label: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Thigh Height (Floor to Thigh)",
//         },
//       ],
//       description: [
//         { languageCode: LanguageCode.en, value: "Shoes - Calf & Leg" },
//       ],
//     },
//     {
//       name: "shoes_calf_and_leg_shaft_height_floor_to_boot_shaft_top",
//       type: "float",
//       label: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Shaft Height (Floor to Boot Shaft Top)",
//         },
//       ],
//       description: [
//         { languageCode: LanguageCode.en, value: "Shoes - Calf & Leg" },
//       ],
//     },
//     {
//       name: "shoes_specialty_ball_to_ball_length_heel_to_1st_and_5th_met_heads",
//       type: "float",
//       label: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Ball-to-Ball Length (Heel to 1st & 5th Met Heads)",
//         },
//       ],
//       description: [
//         { languageCode: LanguageCode.en, value: "Shoes - Specialty" },
//       ],
//     },
//     {
//       name: "shoes_specialty_heel_seat_length_heel_to_ball_center",
//       type: "float",
//       label: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Heel Seat Length (Heel to Ball Center)",
//         },
//       ],
//       description: [
//         { languageCode: LanguageCode.en, value: "Shoes - Specialty" },
//       ],
//     },
//     {
//       name: "shoes_specialty_navicular_height_floor_to_navicular",
//       type: "float",
//       label: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Navicular Height (Floor to Navicular)",
//         },
//       ],
//       description: [
//         { languageCode: LanguageCode.en, value: "Shoes - Specialty" },
//       ],
//     },
//     {
//       name: "shoes_specialty_medial_arch_angle",
//       type: "float",
//       label: [{ languageCode: LanguageCode.en, value: "Medial Arch Angle" }],
//       description: [
//         { languageCode: LanguageCode.en, value: "Shoes - Specialty" },
//       ],
//     },
//     {
//       name: "shoes_specialty_lateral_arch_angle",
//       type: "float",
//       label: [{ languageCode: LanguageCode.en, value: "Lateral Arch Angle" }],
//       description: [
//         { languageCode: LanguageCode.en, value: "Shoes - Specialty" },
//       ],
//     },
//     {
//       name: "shoes_specialty_achilles_length_heel_base_to_calf",
//       type: "float",
//       label: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Achilles Length (Heel Base to Calf)",
//         },
//       ],
//       description: [
//         { languageCode: LanguageCode.en, value: "Shoes - Specialty" },
//       ],
//     },
//     {
//       name: "shoes_specialty_heel_to_instep_ratio",
//       type: "float",
//       label: [{ languageCode: LanguageCode.en, value: "Heel-to-Instep Ratio" }],
//       description: [
//         { languageCode: LanguageCode.en, value: "Shoes - Specialty" },
//       ],
//     },
//     {
//       name: "shoes_specialty_pronation_angle",
//       type: "float",
//       label: [{ languageCode: LanguageCode.en, value: "Pronation Angle" }],
//       description: [
//         { languageCode: LanguageCode.en, value: "Shoes - Specialty" },
//       ],
//     },
//     {
//       name: "shoes_specialty_supination_angle",
//       type: "float",
//       label: [{ languageCode: LanguageCode.en, value: "Supination Angle" }],
//       description: [
//         { languageCode: LanguageCode.en, value: "Shoes - Specialty" },
//       ],
//     },
//     {
//       name: "shoes_specialty_pressure_points_map",
//       type: "text",
//       label: [{ languageCode: LanguageCode.en, value: "Pressure Points Map" }],
//       description: [
//         { languageCode: LanguageCode.en, value: "Shoes - Specialty" },
//       ],
//     },
//     {
//       name: "shoes_specialty_weight_bearing_foot_length_under_load",
//       type: "float",
//       label: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Weight-Bearing Foot Length (Under Load)",
//         },
//       ],
//       description: [
//         { languageCode: LanguageCode.en, value: "Shoes - Specialty" },
//       ],
//     },
//     {
//       name: "shoes_specialty_non_weight_bearing_foot_length",
//       type: "float",
//       label: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Non-Weight-Bearing Foot Length",
//         },
//       ],
//       description: [
//         { languageCode: LanguageCode.en, value: "Shoes - Specialty" },
//       ],
//     },
//     {
//       name: "shoes_specialty_foot_circumference_under_load",
//       type: "float",
//       label: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Foot Circumference under Load",
//         },
//       ],
//       description: [
//         { languageCode: LanguageCode.en, value: "Shoes - Specialty" },
//       ],
//     },
//     // Jewellery Measurements
//     {
//       name: "jewelry_hands_and_fingers_finger_circumference_thumb",
//       type: "float",
//       label: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Finger Circumference - Thumb",
//         },
//       ],
//       description: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Jewelry - Hands & Fingers",
//         },
//       ],
//     },
//     {
//       name: "jewelry_hands_and_fingers_finger_circumference_index",
//       type: "float",
//       label: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Finger Circumference - Index",
//         },
//       ],
//       description: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Jewelry - Hands & Fingers",
//         },
//       ],
//     },
//     {
//       name: "jewelry_hands_and_fingers_finger_circumference_middle",
//       type: "float",
//       label: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Finger Circumference - Middle",
//         },
//       ],
//       description: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Jewelry - Hands & Fingers",
//         },
//       ],
//     },
//     {
//       name: "jewelry_hands_and_fingers_finger_circumference_ring",
//       type: "float",
//       label: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Finger Circumference -Ring",
//         },
//       ],
//       description: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Jewelry - Hands & Fingers",
//         },
//       ],
//     },
//     {
//       name: "jewelry_hands_and_fingers_finger_circumference_little",
//       type: "float",
//       label: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Finger Circumference - Little ",
//         },
//       ],
//       description: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Jewelry - Hands & Fingers",
//         },
//       ],
//     },
//     {
//       name: "jewelry_hands_and_fingers_finger_diameter_all_fingers",
//       type: "text",
//       label: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Finger Diameter (All fingers)",
//         },
//       ],
//       description: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Jewelry - Hands & Fingers",
//         },
//       ],
//     },
//     {
//       name: "jewelry_hands_and_fingers_finger_segment_circumference_base_middle_tip",
//       type: "text",
//       label: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Finger Segment Circumference (Base, Middle, Tip)",
//         },
//       ],
//       description: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Jewelry - Hands & Fingers",
//         },
//       ],
//     },
//     {
//       name: "jewelry_hands_and_fingers_knuckle_circumference_all_fingers",
//       type: "text",
//       label: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Knuckle Circumference (All fingers)",
//         },
//       ],
//       description: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Jewelry - Hands & Fingers",
//         },
//       ],
//     },
//     {
//       name: "jewelry_hands_and_fingers_knuckle_width_across_mcp_joint",
//       type: "float",
//       label: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Knuckle Width (Across MCP Joint)",
//         },
//       ],
//       description: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Jewelry - Hands & Fingers",
//         },
//       ],
//     },
//     {
//       name: "jewelry_hands_and_fingers_finger_length_all_fingers",
//       type: "text",
//       label: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Finger Length (All fingers)",
//         },
//       ],
//       description: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Jewelry - Hands & Fingers",
//         },
//       ],
//     },
//     {
//       name: "jewelry_hands_and_fingers_nail_bed_length_and_width",
//       type: "text",
//       label: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Nail Bed Length & Width",
//         },
//       ],
//       description: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Jewelry - Hands & Fingers",
//         },
//       ],
//     },
//     {
//       name: "jewelry_hands_and_fingers_palm_circumference_over_knuckles_excluding_thumb",
//       type: "float",
//       label: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Palm Circumference (Over knuckles, excluding thumb)",
//         },
//       ],
//       description: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Jewelry - Hands & Fingers",
//         },
//       ],
//     },
//     {
//       name: "jewelry_hands_and_fingers_palm_width_across_metacarpals",
//       type: "float",
//       label: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Palm Width (Across metacarpals)",
//         },
//       ],
//       description: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Jewelry - Hands & Fingers",
//         },
//       ],
//     },
//     {
//       name: "jewelry_hands_and_fingers_palm_length_wrist_crease_to_middle_finger_tip",
//       type: "float",
//       label: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Palm Length (Wrist crease to Middle Finger tip)",
//         },
//       ],
//       description: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Jewelry - Hands & Fingers",
//         },
//       ],
//     },
//     {
//       name: "jewelry_hands_and_fingers_hand_length_wrist_crease_to_finger_tips",
//       type: "float",
//       label: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Hand Length (Wrist crease to Finger tips)",
//         },
//       ],
//       description: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Jewelry - Hands & Fingers",
//         },
//       ],
//     },
//     {
//       name: "jewelry_hands_and_fingers_hand_breadth_widest_across_palm",
//       type: "float",
//       label: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Hand Breadth (Widest across palm)",
//         },
//       ],
//       description: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Jewelry - Hands & Fingers",
//         },
//       ],
//     },
//     {
//       name: "jewelry_wrists_and_arms_wrist_circumference_above_wrist_bone",
//       type: "float",
//       label: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Wrist Circumference (Above wrist bone)",
//         },
//       ],
//       description: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Jewelry - Wrists & Arms",
//         },
//       ],
//     },
//     {
//       name: "jewelry_wrists_and_arms_wrist_width_medial_to_lateral",
//       type: "float",
//       label: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Wrist Width (Medial to lateral)",
//         },
//       ],
//       description: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Jewelry - Wrists & Arms",
//         },
//       ],
//     },
//     {
//       name: "jewelry_wrists_and_arms_wrist_thickness_top_to_bottom",
//       type: "float",
//       label: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Wrist Thickness (Top to Bottom)",
//         },
//       ],
//       description: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Jewelry - Wrists & Arms",
//         },
//       ],
//     },
//     {
//       name: "jewelry_wrists_and_arms_hand_circumference_for_bangle_pass_over",
//       type: "float",
//       label: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Hand Circumference (For Bangle pass-over)",
//         },
//       ],
//       description: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Jewelry - Wrists & Arms",
//         },
//       ],
//     },
//     {
//       name: "jewelry_wrists_and_arms_forearm_circumference_lower_mid_upper",
//       type: "text",
//       label: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Forearm Circumference (Lower, Mid, Upper)",
//         },
//       ],
//       description: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Jewelry - Wrists & Arms",
//         },
//       ],
//     },
//     {
//       name: "jewelry_wrists_and_arms_forearm_length_wrist_to_elbow",
//       type: "float",
//       label: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Forearm Length (Wrist to Elbow)",
//         },
//       ],
//       description: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Jewelry - Wrists & Arms",
//         },
//       ],
//     },
//     {
//       name: "jewelry_wrists_and_arms_elbow_circumference",
//       type: "float",
//       label: [{ languageCode: LanguageCode.en, value: "Elbow Circumference" }],
//       description: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Jewelry - Wrists & Arms",
//         },
//       ],
//     },
//     {
//       name: "jewelry_wrists_and_arms_bicep_circumference",
//       type: "float",
//       label: [{ languageCode: LanguageCode.en, value: "Bicep Circumference" }],
//       description: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Jewelry - Wrists & Arms",
//         },
//       ],
//     },
//     {
//       name: "jewelry_wrists_and_arms_upper_arm_length_shoulder_to_elbow",
//       type: "float",
//       label: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Upper Arm Length (Shoulder to Elbow)",
//         },
//       ],
//       description: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Jewelry - Wrists & Arms",
//         },
//       ],
//     },
//     {
//       name: "jewelry_wrists_and_arms_armlet_position_circumference",
//       type: "float",
//       label: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Armlet Position Circumference",
//         },
//       ],
//       description: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Jewelry - Wrists & Arms",
//         },
//       ],
//     },
//     {
//       name: "jewelry_neck_and_head_neck_circumference_base",
//       type: "float",
//       label: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Neck Circumference (Base)",
//         },
//       ],
//       description: [
//         { languageCode: LanguageCode.en, value: "Jewelry - Neck & Head" },
//       ],
//     },
//     {
//       name: "jewelry_neck_and_head_high_neck_circumference_closer_to_chin",
//       type: "float",
//       label: [
//         {
//           languageCode: LanguageCode.en,
//           value: "High Neck Circumference (Closer to chin)",
//         },
//       ],
//       description: [
//         { languageCode: LanguageCode.en, value: "Jewelry - Neck & Head" },
//       ],
//     },
//     {
//       name: "jewelry_neck_and_head_low_neck_circumference_above_clavicle",
//       type: "float",
//       label: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Low Neck Circumference (Above clavicle)",
//         },
//       ],
//       description: [
//         { languageCode: LanguageCode.en, value: "Jewelry - Neck & Head" },
//       ],
//     },
//     {
//       name: "jewelry_neck_and_head_neck_height_base_to_jaw",
//       type: "float",
//       label: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Neck Height (Base to Jaw)",
//         },
//       ],
//       description: [
//         { languageCode: LanguageCode.en, value: "Jewelry - Neck & Head" },
//       ],
//     },
//     {
//       name: "jewelry_neck_and_head_collarbone_width_shoulder_to_shoulder_at_clavicle",
//       type: "float",
//       label: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Collarbone Width (Shoulder to Shoulder at clavicle)",
//         },
//       ],
//       description: [
//         { languageCode: LanguageCode.en, value: "Jewelry - Neck & Head" },
//       ],
//     },
//     {
//       name: "jewelry_neck_and_head_shoulder_to_shoulder_width_neckline_reference",
//       type: "float",
//       label: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Shoulder to Shoulder Width (Neckline reference)",
//         },
//       ],
//       description: [
//         { languageCode: LanguageCode.en, value: "Jewelry - Neck & Head" },
//       ],
//     },
//     {
//       name: "jewelry_neck_and_head_front_neck_drop_chin_to_clavicle",
//       type: "float",
//       label: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Front Neck Drop (Chin to Clavicle)",
//         },
//       ],
//       description: [
//         { languageCode: LanguageCode.en, value: "Jewelry - Neck & Head" },
//       ],
//     },
//     {
//       name: "jewelry_neck_and_head_back_neck_drop_neck_base_to_upper_back",
//       type: "float",
//       label: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Back Neck Drop (Neck base to Upper Back)",
//         },
//       ],
//       description: [
//         { languageCode: LanguageCode.en, value: "Jewelry - Neck & Head" },
//       ],
//     },
//     {
//       name: "jewelry_neck_and_head_head_circumference_hairline_level",
//       type: "float",
//       label: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Head Circumference (Hairline level)",
//         },
//       ],
//       description: [
//         { languageCode: LanguageCode.en, value: "Jewelry - Neck & Head" },
//       ],
//     },
//     {
//       name: "jewelry_neck_and_head_forehead_width_temple_to_temple",
//       type: "float",
//       label: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Forehead Width (Temple to Temple)",
//         },
//       ],
//       description: [
//         { languageCode: LanguageCode.en, value: "Jewelry - Neck & Head" },
//       ],
//     },
//     {
//       name: "jewelry_neck_and_head_hairline_to_chin_length_face_length",
//       type: "float",
//       label: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Hairline to Chin Length (Face length)",
//         },
//       ],
//       description: [
//         { languageCode: LanguageCode.en, value: "Jewelry - Neck & Head" },
//       ],
//     },
//     {
//       name: "jewelry_ears_and_face_ear_length_top_to_lobe",
//       type: "float",
//       label: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Ear Length (Top to Lobe)",
//         },
//       ],
//       description: [
//         { languageCode: LanguageCode.en, value: "Jewelry - Ears & Face" },
//       ],
//     },
//     {
//       name: "jewelry_ears_and_face_ear_width_widest_point",
//       type: "float",
//       label: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Ear Width (Widest Point)",
//         },
//       ],
//       description: [
//         { languageCode: LanguageCode.en, value: "Jewelry - Ears & Face" },
//       ],
//     },
//     {
//       name: "jewelry_ears_and_face_earlobe_length",
//       type: "float",
//       label: [{ languageCode: LanguageCode.en, value: "Earlobe Length" }],
//       description: [
//         { languageCode: LanguageCode.en, value: "Jewelry - Ears & Face" },
//       ],
//     },
//     {
//       name: "jewelry_ears_and_face_earlobe_width",
//       type: "float",
//       label: [{ languageCode: LanguageCode.en, value: "Earlobe Width" }],
//       description: [
//         { languageCode: LanguageCode.en, value: "Jewelry - Ears & Face" },
//       ],
//     },
//     {
//       name: "jewelry_ears_and_face_piercing_position_lobe_helix_tragus_etc",
//       type: "text",
//       label: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Piercing Position (Lobe, Helix, Tragus, etc.)",
//         },
//       ],
//       description: [
//         { languageCode: LanguageCode.en, value: "Jewelry - Ears & Face" },
//       ],
//     },
//     {
//       name: "jewelry_ears_and_face_piercing_to_piercing_distances",
//       type: "text",
//       label: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Piercing-to-Piercing Distances",
//         },
//       ],
//       description: [
//         { languageCode: LanguageCode.en, value: "Jewelry - Ears & Face" },
//       ],
//     },
//     {
//       name: "jewelry_ears_and_face_nose_length_bridge_to_tip",
//       type: "float",
//       label: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Nose Length (Bridge to Tip)",
//         },
//       ],
//       description: [
//         { languageCode: LanguageCode.en, value: "Jewelry - Ears & Face" },
//       ],
//     },
//     {
//       name: "jewelry_ears_and_face_nose_width_nostril_to_nostril",
//       type: "float",
//       label: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Nose Width (Nostril to Nostril)",
//         },
//       ],
//       description: [
//         { languageCode: LanguageCode.en, value: "Jewelry - Ears & Face" },
//       ],
//     },
//     {
//       name: "jewelry_ears_and_face_nostril_circumference",
//       type: "float",
//       label: [
//         { languageCode: LanguageCode.en, value: "Nostril Circumference" },
//       ],
//       description: [
//         { languageCode: LanguageCode.en, value: "Jewelry - Ears & Face" },
//       ],
//     },
//     {
//       name: "jewelry_ears_and_face_septum_thickness",
//       type: "float",
//       label: [{ languageCode: LanguageCode.en, value: "Septum Thickness" }],
//       description: [
//         { languageCode: LanguageCode.en, value: "Jewelry - Ears & Face" },
//       ],
//     },
//     {
//       name: "jewelry_ears_and_face_cheekbone_width",
//       type: "float",
//       label: [{ languageCode: LanguageCode.en, value: "Cheekbone Width" }],
//       description: [
//         { languageCode: LanguageCode.en, value: "Jewelry - Ears & Face" },
//       ],
//     },
//     {
//       name: "jewelry_ears_and_face_jawline_width",
//       type: "float",
//       label: [{ languageCode: LanguageCode.en, value: "Jawline Width" }],
//       description: [
//         { languageCode: LanguageCode.en, value: "Jewelry - Ears & Face" },
//       ],
//     },
//     {
//       name: "jewelry_waist_and_torso_bust_circumference",
//       type: "float",
//       label: [{ languageCode: LanguageCode.en, value: "Bust Circumference" }],
//       description: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Jewelry - Waist & Torso",
//         },
//       ],
//     },
//     {
//       name: "jewelry_waist_and_torso_underbust_circumference",
//       type: "float",
//       label: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Underbust Circumference",
//         },
//       ],
//       description: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Jewelry - Waist & Torso",
//         },
//       ],
//     },
//     {
//       name: "jewelry_waist_and_torso_waist_circumference",
//       type: "float",
//       label: [{ languageCode: LanguageCode.en, value: "Waist Circumference" }],
//       description: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Jewelry - Waist & Torso",
//         },
//       ],
//     },
//     {
//       name: "jewelry_waist_and_torso_high_waist_circumference",
//       type: "float",
//       label: [
//         {
//           languageCode: LanguageCode.en,
//           value: "High Waist Circumference",
//         },
//       ],
//       description: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Jewelry - Waist & Torso",
//         },
//       ],
//     },
//     {
//       name: "jewelry_waist_and_torso_low_waist_circumference",
//       type: "float",
//       label: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Low Waist Circumference",
//         },
//       ],
//       description: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Jewelry - Waist & Torso",
//         },
//       ],
//     },
//     {
//       name: "jewelry_waist_and_torso_torso_length_neck_base_to_waist",
//       type: "float",
//       label: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Torso Length (Neck base to Waist)",
//         },
//       ],
//       description: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Jewelry - Waist & Torso",
//         },
//       ],
//     },
//     {
//       name: "jewelry_waist_and_torso_shoulder_to_waist_front",
//       type: "float",
//       label: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Shoulder to Waist (Front)",
//         },
//       ],
//       description: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Jewelry - Waist & Torso",
//         },
//       ],
//     },
//     {
//       name: "jewelry_waist_and_torso_shoulder_to_waist_back",
//       type: "float",
//       label: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Shoulder to Waist (Back)",
//         },
//       ],
//       description: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Jewelry - Waist & Torso",
//         },
//       ],
//     },
//     {
//       name: "jewelry_waist_and_torso_shoulder_to_bust_point_apex",
//       type: "float",
//       label: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Shoulder to Bust Point (Apex)",
//         },
//       ],
//       description: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Jewelry - Waist & Torso",
//         },
//       ],
//     },
//     {
//       name: "jewelry_waist_and_torso_bust_point_to_bust_point_apex_to_apex",
//       type: "float",
//       label: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Bust Point to Bust Point (Apex to Apex)",
//         },
//       ],
//       description: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Jewelry - Waist & Torso",
//         },
//       ],
//     },
//     {
//       name: "jewelry_ankles_and_feet_ankle_circumference_above_ankle_bone",
//       type: "float",
//       label: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Ankle Circumference (Above ankle bone)",
//         },
//       ],
//       description: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Jewelry - Ankles & Feet",
//         },
//       ],
//     },
//     {
//       name: "jewelry_ankles_and_feet_ankle_width_side_to_side",
//       type: "float",
//       label: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Ankle Width (Side-to-Side)",
//         },
//       ],
//       description: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Jewelry - Ankles & Feet",
//         },
//       ],
//     },
//     {
//       name: "jewelry_ankles_and_feet_ankle_height_ground_to_ankle_bone",
//       type: "float",
//       label: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Ankle Height (Ground to Ankle Bone)",
//         },
//       ],
//       description: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Jewelry - Ankles & Feet",
//         },
//       ],
//     },
//     {
//       name: "jewelry_ankles_and_feet_foot_length_heel_to_toe",
//       type: "float",
//       label: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Foot Length (Heel to Toe)",
//         },
//       ],
//       description: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Jewelry - Ankles & Feet",
//         },
//       ],
//     },
//     {
//       name: "jewelry_ankles_and_feet_ball_girth_across_metatarsals",
//       type: "float",
//       label: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Ball Girth (Across metatarsals)",
//         },
//       ],
//       description: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Jewelry - Ankles & Feet",
//         },
//       ],
//     },
//     {
//       name: "jewelry_ankles_and_feet_instep_girth_circumference_over_arch",
//       type: "float",
//       label: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Instep Girth (Circumference over arch)",
//         },
//       ],
//       description: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Jewelry - Ankles & Feet",
//         },
//       ],
//     },
//     {
//       name: "jewelry_ankles_and_feet_toe_circumference_all_toes",
//       type: "text",
//       label: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Toe Circumference (All toes)",
//         },
//       ],
//       description: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Jewelry - Ankles & Feet",
//         },
//       ],
//     },
//     {
//       name: "jewelry_ankles_and_feet_toe_lengths_big_to_little_toe",
//       type: "text",
//       label: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Toe Lengths (Big to Little Toe)",
//         },
//       ],
//       description: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Jewelry - Ankles & Feet",
//         },
//       ],
//     },
//     {
//       name: "jewelry_specialty_bangle_slip_measurement_hand_circumference_over_knuckles",
//       type: "float",
//       label: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Bangle Slip Measurement (Hand circumference over knuckles)",
//         },
//       ],
//       description: [
//         { languageCode: LanguageCode.en, value: "Jewelry - Specialty" },
//       ],
//     },
//     {
//       name: "jewelry_specialty_nath_length_nostril_piercing_to_ear_loop",
//       type: "float",
//       label: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Nath Length (Nostril Piercing to Ear Loop)",
//         },
//       ],
//       description: [
//         { languageCode: LanguageCode.en, value: "Jewelry - Specialty" },
//       ],
//     },
//     {
//       name: "jewelry_specialty_maang_tikka_length_hairline_to_forehead_drop",
//       type: "float",
//       label: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Maang Tikka Length (Hairline to Forehead Drop)",
//         },
//       ],
//       description: [
//         { languageCode: LanguageCode.en, value: "Jewelry - Specialty" },
//       ],
//     },
//     {
//       name: "jewelry_specialty_matha_patti_width_temple_to_temple",
//       type: "float",
//       label: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Matha Patti Width (Temple to Temple)",
//         },
//       ],
//       description: [
//         { languageCode: LanguageCode.en, value: "Jewelry - Specialty" },
//       ],
//     },
//     {
//       name: "jewelry_specialty_borla_positioning_circumference",
//       type: "float",
//       label: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Borla Positioning Circumference",
//         },
//       ],
//       description: [
//         { languageCode: LanguageCode.en, value: "Jewelry - Specialty" },
//       ],
//     },
//     {
//       name: "jewelry_specialty_armlet_drop_length_shoulder_to_armlet_position",
//       type: "float",
//       label: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Armlet Drop Length (Shoulder to Armlet Position)",
//         },
//       ],
//       description: [
//         { languageCode: LanguageCode.en, value: "Jewelry - Specialty" },
//       ],
//     },
//     {
//       name: "jewelry_specialty_waistband_drop_length_waist_to_hip_chain_position",
//       type: "float",
//       label: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Waistband Drop Length (Waist to Hip Chain Position)",
//         },
//       ],
//       description: [
//         { languageCode: LanguageCode.en, value: "Jewelry - Specialty" },
//       ],
//     },
//     {
//       name: "jewelry_specialty_anklet_drop_length_ankle_to_mid_foot_chain",
//       type: "float",
//       label: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Anklet Drop Length (Ankle to Mid-Foot Chain)",
//         },
//       ],
//       description: [
//         { languageCode: LanguageCode.en, value: "Jewelry - Specialty" },
//       ],
//     },
//     {
//       name: "jewelry_specialty_headgear_circumference_crown_tiara_position",
//       type: "float",
//       label: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Headgear Circumference (Crown/Tiara Position)",
//         },
//       ],
//       description: [
//         { languageCode: LanguageCode.en, value: "Jewelry - Specialty" },
//       ],
//     },
//     {
//       name: "jewelry_specialty_nose_chain_length_nose_to_ear",
//       type: "float",
//       label: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Nose Chain Length (Nose to Ear)",
//         },
//       ],
//       description: [
//         { languageCode: LanguageCode.en, value: "Jewelry - Specialty" },
//       ],
//     },
//     {
//       name: "jewelry_specialty_backdrop_necklace_length_neck_to_mid_back_drop",
//       type: "float",
//       label: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Backdrop Necklace Length (Neck to Mid-Back Drop)",
//         },
//       ],
//       description: [
//         { languageCode: LanguageCode.en, value: "Jewelry - Specialty" },
//       ],
//     },
//   ],
//   nullable: true,
// };

export const measurementsSchema: CustomFieldConfig = {
  name: "measurements",
  type: "text",
  list: false,
  public: true,
  nullable: true,
};

<?php

namespace Database\Seeders;

use App\Models\Curriculum;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ProgramAndCourseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Programs
        $programs = [
            [
                'code' => 'BSHM',
                'name' => 'Bachelor of Science in Hospitality Management',
                'description' => 'Based on CMO No. 62, Series of 2017 and CMO No. 20, Series of 2013',
            ],
            [
                'code' => 'BSTM',
                'name' => 'Bachelor of Science in Tourism Management',
                'description' => 'Based on CMO No. 62, Series of 2017 and CMO No. 20, Series of 2013',
            ],
            [
                'code' => 'BSE',
                'name' => 'Bachelor of Science in Entrepreneurship',
                'description' => 'Based on CMO No. 18, Series of 2017 and CMO No. 20, Series of 2013',
            ]
        ];

        DB::table('programs')->insert($programs);

        // Subjects
        $subjects = [
            // FIRST YEAR - FIRST SEM
            [
                'code' => 'GE 1',
                'title' => 'Purposive Communication',
                'units' => 3,
                'description' => 'First Year - First Semester',
                
            ],
            [
                'code' => 'GE 2',
                'title' => 'Readings in Philippine History',
                'units' => 3,
                'description' => 'First Year - First Semester',
                
            ],
            [
                'code' => 'GE 3',
                'title' => 'Mathematics in the Modern World',
                'units' => 3,
                'description' => 'First Year - First Semester',
                
            ],
            [
                'code' => 'THC 1',
                'title' => 'Macro Perspective of Tourism and Hospitality',
                'units' => 3,
                'description' => 'First Year - First Semester',
                
            ],
            [
                'code' => 'THC 2',
                'title' => 'Risk Management as Applied to Safety, Security, and Sanitation',
                'units' => 3,
                'description' => 'First Year - First Semester',
                
            ],
            [
                'code' => 'PATHFit 1',
                'title' => 'Movement Competency Training',
                'units' => 2,
                'description' => 'First Year - First Semester',
                
            ],
            [
                'code' => 'NSTP 1',
                'title' => 'CWTS/LTS/ROTC 1',
                'units' => 3,
                'description' => 'First Year - First Semester',
                
            ],

            // FIRST YEAR - SECOND SEM
            [
                'code' => 'TPC 1',
                'title' => 'Global Tourism, Geography, and Culture',
                'units' => 3,
                'description' => 'First Year - Second Semester',
                
            ],
            [
                'code' => 'THC 3',
                'title' => 'Tourism and Hospitality Service Quality Management',
                'units' => 3,
                'description' => 'First Year - Second Semester',
                
            ],
            [
                'code' => 'THC 4',
                'title' => 'Philippine Tourism, Geography, and Culture',
                'units' => 3,
                'description' => 'First Year - Second Semester',
                
            ],
            [
                'code' => 'THC 5',
                'title' => 'Tourism and Hospitality 2 (Micro Perspective of Tourism and Hospitality)',
                'units' => 3,
                'description' => 'First Year - Second Semester',
               
            ],
            [
                'code' => 'TPC 2',
                'title' => 'Tour and Travel Management',
                'units' => 3,
                'description' => 'First Year - Second Semester',
                
            ],
            [
                'code' => 'PATHFit 2',
                'title' => 'Exercise-Based Fitness Activities',
                'units' => 2,
                'description' => 'First Year - Second Semester',
               
            ],
            [
                'code' => 'NSTP 2',
                'title' => 'CWTS/LTS/ROTC 2',
                'units' => 3,
                'description' => 'First Year - Second Semester',
                
            ],

            // SECOND YEAR - FIRST SEM
            [
                'code' => 'GE 4',
                'title' => 'Understanding the Self',
                'units' => 3,
                'description' => 'Second Year - First Semester',
                
            ],
            [
                'code' => 'GE ELECT 1',
                'title' => 'Gender and Society',
                'units' => 3,
                'description' => 'Second Year - First Semester',
                'prerequisite' => 'GE 2',
            ],
            [
                'code' => 'GE ELECT 4',
                'title' => 'Living in the IT Era',
                'units' => 3,
                'description' => 'Second Year - First Semester',
                
            ],
            [
                'code' => 'TPC 3',
                'title' => 'Sustainable Tourism',
                'units' => 3,
                'description' => 'Second Year - First Semester',
                
            ],
            [
                'code' => 'HMPE 1',
                'title' => 'Recreation and Leisure Management',
                'units' => 3,
                'description' => 'Second Year - First Semester',
                'prerequisite' => 'THC 5',
            ],
            [
                'code' => 'GE ELECT 2',
                'title' => 'Environmental Science',
                'units' => 3,
                'description' => 'Second Year - First Semester',
                
            ],
            [
                'code' => 'PATHFit 3',
                'title' => 'Physical Activities towards Health and Fitness 3 (Badminton)',
                'units' => 2,
                'description' => 'Second Year - First Semester',
                'prerequisite' => 'PATHFit 2',
            ],

            // SECOND YEAR - SECOND SEM
            [
                'code' => 'GE 5',
                'title' => 'Science, Technology, and Society',
                'units' => 3,
                'description' => 'Second Year - Second Semester',
                'prerequisite' => 'GE ELECT 2',
            ],
            [
                'code' => 'GE 6',
                'title' => 'Ethics',
                'units' => 3,
                'description' => 'Second Year - Second Semester',
                'prerequisite' => 'GE 4',
            ],
            [
                'code' => 'TPC 4',
                'title' => 'Tourism Policy Planning and Development',
                'units' => 3,
                'description' => 'Second Year - Second Semester',
                'prerequisite' => 'THC 5',
            ],
            [
                'code' => 'TPC 5',
                'title' => 'Introduction to MICE',
                'units' => 3,
                'description' => 'Second Year - Second Semester',
                'prerequisite' => 'TPC 1',
            ],
            [
                'code' => 'HMPE 2',
                'title' => 'Bar and Beverage Management with Lab',
                'units' => 3,
                'description' => 'Second Year - Second Semester',
                
            ],
            [
                'code' => 'TPC 6',
                'title' => 'Foreign Language 1',
                'units' => 3,
                'description' => 'Second Year - Second Semester',
                
            ],
            [
                'code' => 'PATHFit 4',
                'title' => 'Physical Activities towards Health and Fitness 4 (Basketball)',
                'units' => 2,
                'description' => 'Second Year - Second Semester',
                'prerequisite' => 'PATHFit 3',
            ],

            // THIRD YEAR - FIRST SEM
            [
                'code' => 'GE 7',
                'title' => 'The Contemporary World',
                'units' => 3,
                'description' => 'Third Year - First Semester',
                'prerequisite' => 'GE ELECT 1',
            ],
            [
                'code' => 'TPC 8',
                'title' => 'Research in Tourism',
                'units' => 3,
                'description' => 'Third Year - First Semester',
                'prerequisite' => 'GE 1',
            ],
            [
                'code' => 'HMPE 3',
                'title' => 'Front Office Operation',
                'units' => 3,
                'description' => 'Third Year - First Semester',
                'prerequisite' => 'HMPE 1',
            ],
            [
                'code' => 'BME 1',
                'title' => 'Operations Management in TH Industry',
                'units' => 3,
                'description' => 'Third Year - First Semester',
                'prerequisite' => 'THC 1',
            ],
            [
                'code' => 'THC 6',
                'title' => 'Professional Development and Applied Ethics',
                'units' => 3,
                'description' => 'Third Year - First Semester',
                'prerequisite' => 'GE 6',
            ],
            [
                'code' => 'THC 7',
                'title' => 'Tourism and Hospitality Marketing',
                'units' => 3,
                'description' => 'Third Year - First Semester',
                'prerequisite' => 'THC 1',
            ],

            // THIRD YEAR - SECOND SEM
            [
                'code' => 'THC 8',
                'title' => 'Legal Aspects in Tourism and Hospitality',
                'units' => 3,
                'description' => 'Third Year - Second Semester',
                'prerequisite' => 'THC 1/THC 2',
            ],
            [
                'code' => 'GE ELECT 3',
                'title' => 'PEACE Education',
                'units' => 3,
                'description' => 'Third Year - Second Semester',
                'prerequisite' => 'GE ELECT 2/TPC 3/GE 6',
            ],
            [
                'code' => 'BME 2',
                'title' => 'Strategic Management in Tourism and Hospitality 1',
                'units' => 3,
                'description' => 'Third Year - Second Semester',
                'prerequisite' => 'THC 1',
            ],
            [
                'code' => 'HMPE 4',
                'title' => 'Housekeeping Operation',
                'units' => 3,
                'description' => 'Third Year - Second Semester',
                'prerequisite' => 'HMPE 3',
            ],
            [
                'code' => 'THC 9',
                'title' => 'Multicultural Diversity in Workplace for the Tourism Professional',
                'units' => 3,
                'description' => 'Third Year - Second Semester',
                'prerequisite' => 'THC 4',
            ],
            [
                'code' => 'GE ELECT 5',
                'title' => 'Entrepreneurial Mind',
                'units' => 3,
                'description' => 'Third Year - Second Semester',
                'prerequisite' => 'THC 1',
            ],
            [
                'code' => 'TPC 7',
                'title' => 'Transportation Management',
                'units' => 3,
                'description' => 'Third Year - Second Semester',
                'prerequisite' => 'THC 1/THC 2',
            ],

            // FOURTH YEAR - FIRST SEM
            [
                'code' => 'HMPE 5',
                'title' => 'Food and Beverage Service with Lab',
                'units' => 3,
                'description' => 'Fourth Year - First Semester',
                'prerequisite' => 'HMPE 2',
            ],
            [
                'code' => 'RIZAL',
                'title' => 'Life and Works of Rizal',
                'units' => 3,
                'description' => 'Fourth Year - First Semester',
                
            ],
            [
                'code' => 'TPC 9',
                'title' => 'Foreign Language 2',
                'units' => 3,
                'description' => 'Fourth Year - First Semester',
                'prerequisite' => 'TPC 6',
            ],
            [
                'code' => 'TPC 10',
                'title' => 'Applied Business Tools Technology in Tourism with Lab',
                'units' => 4,
                'description' => 'Fourth Year - First Semester',
                'prerequisite' => 'GE ELECT 4',
            ],
            [
                'code' => 'THC 10',
                'title' => 'Entrepreneurship in Tourism and Hospitality',
                'units' => 3,
                'description' => 'Fourth Year - First Semester',
                'prerequisite' => 'THC 1/GE ELECT 5',
            ],
            [
                'code' => 'GE 8',
                'title' => 'Art Appreciation',
                'units' => 3,
                'description' => 'Fourth Year - First Semester',
                
            ],

            // FOURTH YEAR - SECOND SEM
            [
                'code' => 'PRACTICUM',
                'title' => 'Practicum in Tourism and Hospitality Industry',
                'units' => 6,
                'description' => 'Fourth Year - Second Semester',
                'prerequisite' => 'Finished all Academic Requirements',
            ],





            // FIRST YEAR - FIRST SEMESTER
            [
                'code' => 'GE 1',
                'title' => 'Understanding the Self',
                'units' => 3,
                'description' => 'BSE - First Year - First Semester',
                
            ],
            [
                'code' => 'GE 2',
                'title' => 'Readings in Philippine History',
                'units' => 3,
                'description' => 'BSE - First Year - First Semester',
                
            ],
            [
                'code' => 'GE 3',
                'title' => 'The Contemporary World',
                'units' => 3,
                'description' => 'BSE - First Year - First Semester',
                
            ],
            [
                'code' => 'ENT 1',
                'title' => 'Entrepreneurial Behavior',
                'units' => 3,
                'description' => 'BSE - First Year - First Semester',
                
            ],
            [
                'code' => 'MGT 1',
                'title' => 'Principles of Management',
                'units' => 3,
                'description' => 'BSE - First Year - First Semester',
                
            ],
            [
                'code' => 'PATHFit 1',
                'title' => 'Movement Competency Training',
                'units' => 2,
                'description' => 'BSE - First Year - First Semester',
                
            ],
            [
                'code' => 'NSTP 1',
                'title' => 'CWTS/LTS/ROTC 1',
                'units' => 3,
                'description' => 'BSE - First Year - First Semester',
                
            ],

            // FIRST YEAR - SECOND SEMESTER
            [
                'code' => 'GE 4',
                'title' => 'Mathematics in the Modern World',
                'units' => 3,
                'description' => 'BSE - First Year - Second Semester',
                
            ],
            [
                'code' => 'ENT 2',
                'title' => 'Microeconomics',
                'units' => 3,
                'description' => 'BSE - First Year - Second Semester',
                'prerequisite' => 'ENT 1',
            ],
            [
                'code' => 'MKG 1',
                'title' => 'Principles of Marketing',
                'units' => 3,
                'description' => 'BSE - First Year - Second Semester',
                'prerequisite' => 'MGT 1',
            ],
            [
                'code' => 'GE 5',
                'title' => 'Purposive Communication',
                'units' => 3,
                'description' => 'BSE - First Year - Second Semester',
                
            ],
            [
                'code' => 'GE 6',
                'title' => 'Art Appreciation',
                'units' => 3,
                'description' => 'BSE - First Year - Second Semester',
                
            ],
            [
                'code' => 'PATHFit 2',
                'title' => 'Exercise-Based Fitness Activities',
                'units' => 2,
                'description' => 'BSE - First Year - Second Semester',
                'prerequisite' => 'PATHFit 1',
            ],
            [
                'code' => 'NSTP 2',
                'title' => 'CWTS/LTS/ROTC 2',
                'units' => 3,
                'description' => 'BSE - First Year - Second Semester',
                'prerequisite' => 'NSTP 1',
            ],

            // SECOND YEAR - FIRST SEMESTER
            [
                'code' => 'GE 7',
                'title' => 'Science, Technology, and Society',
                'units' => 3,
                'description' => 'BSE - Second Year - First Semester',
                
            ],
            [
                'code' => 'GE 8',
                'title' => 'Ethics',
                'units' => 3,
                'description' => 'BSE - Second Year - First Semester',
                
            ],
            [
                'code' => 'ENT 3',
                'title' => 'Opportunity Seeking',
                'units' => 3,
                'description' => 'BSE - Second Year - First Semester',
                'prerequisite' => 'ENT 2',
            ],
            [
                'code' => 'ENT 4',
                'title' => 'Market Research and Consumer Behavior',
                'units' => 3,
                'description' => 'BSE - Second Year - First Semester',
                'prerequisite' => 'MKG 1/ENT 3',
            ],
            [
                'code' => 'GE ELECT 1',
                'title' => 'Social Science and Philosophy',
                'units' => 3,
                'description' => 'BSE - Second Year - First Semester',
                
            ],
            [
                'code' => 'ACCTG 1',
                'title' => 'Accounting, Business, and Management 1',
                'units' => 3,
                'description' => 'BSE - Second Year - First Semester',
                
            ],
            [
                'code' => 'PATHFit 3',
                'title' => 'Physical Activities towards Health and Fitness 3 (Badminton)',
                'units' => 2,
                'description' => 'BSE - Second Year - First Semester',
                'prerequisite' => 'PATHFit 2',
            ],

            // SECOND YEAR - SECOND SEMESTER
            [
                'code' => 'GE ELECT 2',
                'title' => 'Arts and Humanities',
                'units' => 3,
                'description' => 'BSE - Second Year - Second Semester',
                'prerequisite' => 'GE ELECT 1',
            ],
            [
                'code' => 'ENT 5',
                'title' => 'Social Entrepreneurship',
                'units' => 3,
                'description' => 'BSE - Second Year - Second Semester',
                'prerequisite' => 'ENT 3/ENT 4',
            ],
            [
                'code' => 'ENT 6',
                'title' => 'Innovation Management',
                'units' => 3,
                'description' => 'BSE - Second Year - Second Semester',
                'prerequisite' => 'ENT 4/ENT 5',
            ],
            [
                'code' => 'ENT 7',
                'title' => 'Pricing and Costing',
                'units' => 3,
                'description' => 'BSE - Second Year - Second Semester',
                'prerequisite' => 'ACCTG 1',
            ],
            [
                'code' => 'HRM',
                'title' => 'Human Resources Management',
                'units' => 3,
                'description' => 'BSE - Second Year - Second Semester',
                'prerequisite' => 'MGT 1/ENT 1',
            ],
            [
                'code' => 'ACCTG 2',
                'title' => 'Accounting, Business, and Management 2',
                'units' => 3,
                'description' => 'BSE - Second Year - Second Semester',
                'prerequisite' => 'ACCTG 1',
            ],
            [
                'code' => 'PATHFit 4',
                'title' => 'Physical Activities towards Health and Fitness 4 (Basketball)',
                'units' => 2,
                'description' => 'BSE - Second Year - Second Semester',
                'prerequisite' => 'PATHFit 3',
            ],

            // THIRD YEAR - FIRST SEMESTER
            [
                'code' => 'ENT 8',
                'title' => 'Financial Management (Financial Analysis for Decision Making)',
                'units' => 3,
                'description' => 'BSE - Third Year - First Semester',
                'prerequisite' => 'ENT 7/ACCTG 2',
            ],
            [
                'code' => 'OM',
                'title' => 'Operations Management',
                'units' => 3,
                'description' => 'BSE - Third Year - First Semester',
                'prerequisite' => 'MGT/HRM/ACCTG',
            ],
            [
                'code' => 'HUM 1',
                'title' => 'Philippine Popular Culture',
                'units' => 3,
                'description' => 'BSE - Third Year - First Semester',
                'prerequisite' => 'GE ELECT 2',
            ],
            [
                'code' => 'MOE 1',
                'title' => 'Microsoft Productivity Tool 1',
                'units' => 2,
                'description' => 'BSE - Third Year - First Semester',
                'prerequisite' => 'ACCTG 2',
            ],
            [
                'code' => 'ELT 1',
                'title' => 'Hospitality Management',
                'units' => 3,
                'description' => 'BSE - Third Year - First Semester',
                'prerequisite' => 'MGT 1',
            ],
            [
                'code' => 'ELT 2',
                'title' => 'Events Management',
                'units' => 3,
                'description' => 'BSE - Third Year - First Semester',
                'prerequisite' => 'MGT 1',
            ],

            // THIRD YEAR - SECOND SEMESTER
            [
                'code' => 'ENT 9',
                'title' => 'Business Plan Preparation',
                'units' => 3,
                'description' => 'BSE - Third Year - Second Semester',
                'prerequisite' => 'ENT 8',
            ],
            [
                'code' => 'STRAMA',
                'title' => 'Strategic Management',
                'units' => 3,
                'description' => 'BSE - Third Year - Second Semester',
                'prerequisite' => 'OM',
            ],
            [
                'code' => 'MOE 2',
                'title' => 'Microsoft Productivity Tool 2',
                'units' => 2,
                'description' => 'BSE - Third Year - Second Semester',
                'prerequisite' => 'MOE 1',
            ],
            [
                'code' => 'ELT 3',
                'title' => 'Managing a Service Enterprise',
                'units' => 3,
                'description' => 'BSE - Third Year - Second Semester',
                'prerequisite' => 'OM/ELT/ELT 1',
            ],
            [
                'code' => 'ELT 4',
                'title' => 'Entrepreneurial Leadership in an Organization',
                'units' => 3,
                'description' => 'BSE - Third Year - Second Semester',
                'prerequisite' => 'ENT 1',
            ],
            [
                'code' => 'MDA',
                'title' => 'Multimedia Development Application',
                'units' => 3,
                'description' => 'BSE - Third Year - Second Semester',
                'prerequisite' => 'MOE 1',
            ],

            // FOURTH YEAR - FIRST SEMESTER
            [
                'code' => 'LAW',
                'title' => 'Business Law and Taxation',
                'units' => 3,
                'description' => 'BSE - Fourth Year - First Semester',
                'prerequisite' => 'ACCTG 2',
            ],
            [
                'code' => 'GE 9',
                'title' => 'Life and Works of Rizal',
                'units' => 3,
                'description' => 'BSE - Fourth Year - First Semester',
                'prerequisite' => 'GE ELECT 1',
            ],
            [
                'code' => 'ENT 10',
                'title' => 'Business Plan Implementation 1',
                'units' => 5,
                'description' => 'BSE - Fourth Year - First Semester',
                'prerequisite' => 'ENT 9',
            ],
            [
                'code' => 'MIS',
                'title' => 'Management Information System',
                'units' => 5,
                'description' => 'BSE - Fourth Year - First Semester',
                'prerequisite' => 'MOE 2',
            ],
            [
                'code' => 'ELT 5',
                'title' => 'Entrepreneurial Marketing Strategies',
                'units' => 3,
                'description' => 'BSE - Fourth Year - First Semester',
                'prerequisite' => 'ELT 4',
            ],

            // FOURTH YEAR - SECOND SEMESTER
            [
                'code' => 'ENT 11',
                'title' => 'Business Plan Implementation 2',
                'units' => 5,
                'description' => 'BSE - Fourth Year - Second Semester',
                'prerequisite' => 'ENT 10',
            ],
            [
                'code' => 'ENT 12',
                'title' => 'International Business and Trade',
                'units' => 3,
                'description' => 'BSE - Fourth Year - Second Semester',
                'prerequisite' => 'OM/ELT 4/STRAMA',
            ],
            [
                'code' => 'ENT 13',
                'title' => 'Programs and Policies on Enterprise Development',
                'units' => 3,
                'description' => 'BSE - Fourth Year - Second Semester',
                'prerequisite' => 'STRAMA/ELT',
            ],



            // FIRST YEAR - FIRST SEMESTER
            [
                'code' => 'GE 1',
                'title' => 'Purposive Communication',
                'units' => 3,
                'description' => 'BSHM - First Year - First Semester',
                
            ],
            [
                'code' => 'GE 2',
                'title' => 'Readings in Philippine History',
                'units' => 3,
                'description' => 'BSHM - First Year - First Semester',
                
            ],
            [
                'code' => 'GE 3',
                'title' => 'Mathematics in the Modern World',
                'units' => 3,
                'description' => 'BSHM - First Year - First Semester',
                
            ],
            [
                'code' => 'THC 1',
                'title' => 'Macro Perspective of Tourism and Hospitality',
                'units' => 3,
                'description' => 'BSHM - First Year - First Semester',
                
            ],
            [
                'code' => 'THC 2',
                'title' => 'Risk Management as Applied to Safety, Security, and Sanitation',
                'units' => 3,
                'description' => 'BSHM - First Year - First Semester',
                
            ],
            [
                'code' => 'PATHFit 1',
                'title' => 'Movement Competency Training',
                'units' => 2,
                'description' => 'BSHM - First Year - First Semester',
                
            ],
            [
                'code' => 'NSTP 1',
                'title' => 'CWTS/LTS/ROTC 1',
                'units' => 3,
                'description' => 'BSHM - First Year - First Semester',
                
            ],

            // FIRST YEAR - SECOND SEMESTER
            [
                'code' => 'THC 3',
                'title' => 'Quality Service Management in Tourism and Hospitality',
                'units' => 3,
                'description' => 'BSHM - First Year - Second Semester',
                'prerequisite' => 'THC 2',
            ],
            [
                'code' => 'THC 4',
                'title' => 'Philippine Tourism, Geography, and Culture',
                'units' => 3,
                'description' => 'BSHM - First Year - Second Semester',
                'prerequisite' => 'THC 1',
            ],
            [
                'code' => 'THC 5',
                'title' => 'Micro Perspective of Tourism and Hospitality',
                'units' => 3,
                'description' => 'BSHM - First Year - Second Semester',
                'prerequisite' => 'THC 1',
            ],
            [
                'code' => 'HPC 1',
                'title' => 'Kitchen Essentials & Basic Food Preparation',
                'units' => 3,
                'description' => 'BSHM - First Year - Second Semester',
                'prerequisite' => 'THC 2',
            ],
            [
                'code' => 'HPC 2',
                'title' => 'Fundamentals in Lodging Operations',
                'units' => 3,
                'description' => 'BSHM - First Year - Second Semester',
                'prerequisite' => 'THC 1',
            ],
            [
                'code' => 'PATHFit 2',
                'title' => 'Exercise-Based Fitness Activities',
                'units' => 2,
                'description' => 'BSHM - First Year - Second Semester',
                'prerequisite' => 'PATHFit 1',
            ],
            [
                'code' => 'NSTP 2',
                'title' => 'CWTS/LTS/ROTC 2',
                'units' => 3,
                'description' => 'BSHM - First Year - Second Semester',
                'prerequisite' => 'NSTP 1',
            ],

            // SECOND YEAR - FIRST SEMESTER
            [
                'code' => 'GE 4',
                'title' => 'Understanding the Self',
                'units' => 3,
                'description' => 'BSHM - Second Year - First Semester',
                
            ],
            [
                'code' => 'GE ELECT 1',
                'title' => 'Gender and Society',
                'units' => 3,
                'description' => 'BSHM - Second Year - First Semester',
                'prerequisite' => 'GE 2',
            ],
            [
                'code' => 'HPC 3',
                'title' => 'Applied Business Tools and Technologies (PMS) with Lab',
                'units' => 3,
                'description' => 'BSHM - Second Year - First Semester',
                
            ],
            [
                'code' => 'HPC 4',
                'title' => 'Supply Chain Management in Hospitality Industry',
                'units' => 3,
                'description' => 'BSHM - Second Year - First Semester',
                'prerequisite' => 'THC 3',
            ],
            [
                'code' => 'HPC 5',
                'title' => 'Foreign Language 1',
                'units' => 3,
                'description' => 'BSHM - Second Year - First Semester',
                
            ],
            [
                'code' => 'PATHFit 3',
                'title' => 'Physical Activities towards Health and Fitness 3 (Badminton)',
                'units' => 2,
                'description' => 'BSHM - Second Year - First Semester',
                'prerequisite' => 'PATHFit 2',
            ],
            [
                'code' => 'GE 5',
                'title' => 'Indigenous People',
                'units' => 3,
                'description' => 'BSHM - Second Year - First Semester',
                'prerequisite' => 'GE 4',
            ],

            // SECOND YEAR - SECOND SEMESTER
            [
                'code' => 'GE 6',
                'title' => 'Science, Technology, and Society',
                'units' => 3,
                'description' => 'BSHM - Second Year - Second Semester',
                'prerequisite' => 'GE ELECT 1',
            ],
            [
                'code' => 'GE 7',
                'title' => 'Ethics',
                'units' => 3,
                'description' => 'BSHM - Second Year - Second Semester',
                'prerequisite' => 'GE ELECT 1',
            ],
            [
                'code' => 'HPC 6',
                'title' => 'Fundamentals in Food Service Operations',
                'units' => 3,
                'description' => 'BSHM - Second Year - Second Semester',
                'prerequisite' => 'HPC 1',
            ],
            [
                'code' => 'HPC 7',
                'title' => 'Introduction to MICE',
                'units' => 3,
                'description' => 'BSHM - Second Year - Second Semester',
                'prerequisite' => 'THC 5',
            ],
            [
                'code' => 'HMPE 1',
                'title' => 'Introduction to Transport Services',
                'units' => 3,
                'description' => 'BSHM - Second Year - Second Semester',
                
            ],
            [
                'code' => 'HPC 8',
                'title' => 'Foreign Language 2',
                'units' => 3,
                'description' => 'BSHM - Second Year - Second Semester',
                'prerequisite' => 'HPC 5',
            ],
            [
                'code' => 'PATHFit 4',
                'title' => 'Physical Activities towards Health and Fitness 4 (Basketball)',
                'units' => 2,
                'description' => 'BSHM - Second Year - Second Semester',
                'prerequisite' => 'PATHFit 3',
            ],

            // THIRD YEAR - FIRST SEMESTER
            [
                'code' => 'GE 8',
                'title' => 'The Contemporary World',
                'units' => 3,
                'description' => 'BSHM - Third Year - First Semester',
                'prerequisite' => 'GE ELECT 1',
            ],
            [
                'code' => 'HMPE 2',
                'title' => 'Bar and Beverage Management with Laboratory',
                'units' => 3,
                'description' => 'BSHM - Third Year - First Semester',
                'prerequisite' => 'HPC 6',
            ],
            [
                'code' => 'HMPE 3',
                'title' => 'Front Office Operation',
                'units' => 3,
                'description' => 'BSHM - Third Year - First Semester',
                'prerequisite' => 'THC 5',
            ],
            [
                'code' => 'BME 1',
                'title' => 'Operations Management in Tourism and Hospitality Industry',
                'units' => 3,
                'description' => 'BSHM - Third Year - First Semester',
                'prerequisite' => 'TPC 3',
            ],
            [
                'code' => 'THC 6',
                'title' => 'Professional Development and Applied Ethics',
                'units' => 3,
                'description' => 'BSHM - Third Year - First Semester',
                'prerequisite' => 'GE 6',
            ],
            [
                'code' => 'THC 7',
                'title' => 'Tourism and Hospitality Marketing',
                'units' => 3,
                'description' => 'BSHM - Third Year - First Semester',
                'prerequisite' => 'TPC 3',
            ],
            [
                'code' => 'HPC 10',
                'title' => 'Research in Hospitality',
                'units' => 3,
                'description' => 'BSHM - Third Year - First Semester',
                'prerequisite' => 'GE 1',
            ],

            // THIRD YEAR - SECOND SEMESTER
            [
                'code' => 'BME 2',
                'title' => 'Strategic Management in Tourism and Hospitality',
                'units' => 3,
                'description' => 'BSHM - Third Year - Second Semester',
                'prerequisite' => 'BME 1',
            ],
            [
                'code' => 'THC 8',
                'title' => 'Legal Aspects in Tourism and Hospitality',
                'units' => 3,
                'description' => 'BSHM - Third Year - Second Semester',
                'prerequisite' => 'HMPE 2',
            ],
            [
                'code' => 'THC 9',
                'title' => 'Multicultural Diversity in the Workplace for the Tourism Professional',
                'units' => 3,
                'description' => 'BSHM - Third Year - Second Semester',
                'prerequisite' => 'BME 1',
            ],
            [
                'code' => 'THC 10',
                'title' => 'Entrepreneurship in Tourism and Hospitality',
                'units' => 3,
                'description' => 'BSHM - Third Year - Second Semester',
                'prerequisite' => 'BME 1',
            ],
            [
                'code' => 'GE ELECT 5',
                'title' => 'The Entrepreneurial Mind',
                'units' => 3,
                'description' => 'BSHM - Third Year - Second Semester',
                'prerequisite' => 'BME 1',
            ],
            [
                'code' => 'HPC 9',
                'title' => 'Ergonomics and Facilities Planning for the Hospitality Industry',
                'units' => 3,
                'description' => 'BSHM - Third Year - Second Semester',
                'prerequisite' => 'BME 1',
            ],
            [
                'code' => 'HMPE 4',
                'title' => 'Housekeeping Operations',
                'units' => 3,
                'description' => 'BSHM - Third Year - Second Semester',
                'prerequisite' => 'HMPE 1',
            ],

            // FOURTH YEAR - FIRST SEMESTER
            [
                'code' => 'HMPE 5',
                'title' => 'Food and Beverage Service with Lab',
                'units' => 3,
                'description' => 'BSHM - Fourth Year - First Semester',
                'prerequisite' => 'HPC 1',
            ],
            [
                'code' => 'RIZAL',
                'title' => 'Life and Works of Rizal',
                'units' => 3,
                'description' => 'BSHM - Fourth Year - First Semester',
                
            ],
            [
                'code' => 'GE ELECT 2',
                'title' => 'Environmental Science',
                'units' => 3,
                'description' => 'BSHM - Fourth Year - First Semester',
                'prerequisite' => 'GE 5',
            ],
            [
                'code' => 'GE ELECT 3',
                'title' => 'PEACE Education',
                'units' => 3,
                'description' => 'BSHM - Fourth Year - First Semester',
                'prerequisite' => 'GE 4',
            ],
            [
                'code' => 'GE 9',
                'title' => 'Art Appreciation',
                'units' => 3,
                'description' => 'BSHM - Fourth Year - First Semester',
                
            ],

            // FOURTH YEAR - SECOND SEMESTER
            [
                'code' => 'PRACTICUM',
                'title' => 'Practicum in Tourism and Hospitality Industry',
                'units' => 6,
                'description' => 'BSHM - Fourth Year - Second Semester',
                'prerequisite' => 'Finished all Academic Requirements',
            ],

        ];

        $subjects = array_map(function($subject) {
            unset($subject['prerequisite']);
            return $subject;
        }, $subjects);

        $subjects = collect($subjects)
            ->unique('code')
            ->values()
            ->toArray();

        DB::table('subjects')->insert($subjects);


        $programIds = DB::table('programs')
            ->pluck('id', 'code');

        $subjectIds = DB::table('subjects')
            ->pluck('id', 'code');


        // Curriculums
        // program_id,subject_id,year_level,semester,prerequisite
        $curriculumns = [
            // FIRST YEAR - First Semester
            [
                'program_id' => $programIds['BSTM'],
                'subject_id' => $subjectIds['GE 1'],
                'year_level' => 1,
                'semester' => 1,
                
            ],
            [
                'program_id' => $programIds['BSTM'],
                'subject_id' => $subjectIds['GE 2'],
                'year_level' => 1,
                'semester' => 1,
                
            ],
            [
                'program_id' => $programIds['BSTM'],
                'subject_id' => $subjectIds['GE 3'],
                'year_level' => 1,
                'semester' => 1,
                
            ],
            [
                'program_id' => $programIds['BSTM'],
                'subject_id' => $subjectIds['THC 1'],
                'year_level' => 1,
                'semester' => 1,
                
            ],
            [
                'program_id' => $programIds['BSTM'],
                'subject_id' => $subjectIds['THC 2'],
                'year_level' => 1,
                'semester' => 1,
                
            ],
            [
                'program_id' => $programIds['BSTM'],
                'subject_id' => $subjectIds['PATHFit 1'],
                'year_level' => 1,
                'semester' => 1,
                
            ],
            [
                'program_id' => $programIds['BSTM'],
                'subject_id' => $subjectIds['NSTP 1'],
                'year_level' => 1,
                'semester' => 1,
                
            ],

            // FIRST YEAR - Second Semester
            [
                'program_id' => $programIds['BSTM'],
                'subject_id' => $subjectIds['TPC 1'],
                'year_level' => 1,
                'semester' => 2,
                
            ],
            [
                'program_id' => $programIds['BSTM'],
                'subject_id' => $subjectIds['THC 3'],
                'year_level' => 1,
                'semester' => 2,
                'prerequisite' => 'THC 1',
            ],
            [
                'program_id' => $programIds['BSTM'],
                'subject_id' => $subjectIds['THC 4'],
                'year_level' => 1,
                'semester' => 2,
                'prerequisite' => 'GE 2/THC 1',
            ],
            [
                'program_id' => $programIds['BSTM'],
                'subject_id' => $subjectIds['THC 5'],
                'year_level' => 1,
                'semester' => 2,
                'prerequisite' => 'THC 1',
            ],
            [
                'program_id' => $programIds['BSTM'],
                'subject_id' => $subjectIds['TPC 2'],
                'year_level' => 1,
                'semester' => 2,
                'prerequisite' => 'THC 1',
            ],
            [
                'program_id' => $programIds['BSTM'],
                'subject_id' => $subjectIds['PATHFit 2'],
                'year_level' => 1,
                'semester' => 2,
                'prerequisite' => 'PATHFit 1',
            ],
            [
                'program_id' => $programIds['BSTM'],
                'subject_id' => $subjectIds['NSTP 2'],
                'year_level' => 1,
                'semester' => 2,
                'prerequisite' => 'NSTP 1',
            ],

            // SECOND YEAR - First Semester
            [
                'program_id' => $programIds['BSTM'],
                'subject_id' => $subjectIds['GE 4'],
                'year_level' => 2,
                'semester' => 1,
                
            ],
            [
                'program_id' => $programIds['BSTM'],
                'subject_id' => $subjectIds['GE ELECT 1'],
                'year_level' => 2,
                'semester' => 1,
                'prerequisite' => 'GE 2',
            ],
            [
                'program_id' => $programIds['BSTM'],
                'subject_id' => $subjectIds['GE ELECT 4'],
                'year_level' => 2,
                'semester' => 1,
                
            ],
            [
                'program_id' => $programIds['BSTM'],
                'subject_id' => $subjectIds['TPC 3'],
                'year_level' => 2,
                'semester' => 1,
                
            ],
            [
                'program_id' => $programIds['BSTM'],
                'subject_id' => $subjectIds['HMPE 1'],
                'year_level' => 2,
                'semester' => 1,
                'prerequisite' => 'THC 5',
            ],
            [
                'program_id' => $programIds['BSTM'],
                'subject_id' => $subjectIds['GE ELECT 2'],
                'year_level' => 2,
                'semester' => 1,
                
            ],
            [
                'program_id' => $programIds['BSTM'],
                'subject_id' => $subjectIds['PATHFit 3'],
                'year_level' => 2,
                'semester' => 1,
                'prerequisite' => 'PATHFit 2',
            ],

            // SECOND YEAR - Second Semester
            [
                'program_id' => $programIds['BSTM'],
                'subject_id' => $subjectIds['GE 5'],
                'year_level' => 2,
                'semester' => 2,
                'prerequisite' => 'GE ELECT 2',
            ],
            [
                'program_id' => $programIds['BSTM'],
                'subject_id' => $subjectIds['GE 6'],
                'year_level' => 2,
                'semester' => 2,
                'prerequisite' => 'GE 4',
            ],
            [
                'program_id' => $programIds['BSTM'],
                'subject_id' => $subjectIds['TPC 4'],
                'year_level' => 2,
                'semester' => 2,
                'prerequisite' => 'THC 5',
            ],
            [
                'program_id' => $programIds['BSTM'],
                'subject_id' => $subjectIds['TPC 5'],
                'year_level' => 2,
                'semester' => 2,
                'prerequisite' => 'TPC 1',
            ],
            [
                'program_id' => $programIds['BSTM'],
                'subject_id' => $subjectIds['HMPE 2'],
                'year_level' => 2,
                'semester' => 2,
                
            ],
            [
                'program_id' => $programIds['BSTM'],
                'subject_id' => $subjectIds['TPC 6'],
                'year_level' => 2,
                'semester' => 2,
                
            ],
            [
                'program_id' => $programIds['BSTM'],
                'subject_id' => $subjectIds['PATHFit 4'],
                'year_level' => 2,
                'semester' => 2,
                'prerequisite' => 'PATHFit 3',
            ],

            // THIRD YEAR - First Semester
            [
                'program_id' => $programIds['BSTM'],
                'subject_id' => $subjectIds['GE 7'],
                'year_level' => 3,
                'semester' => 1,
                'prerequisite' => 'GE ELECT 1',
            ],
            [
                'program_id' => $programIds['BSTM'],
                'subject_id' => $subjectIds['TPC 8'],
                'year_level' => 3,
                'semester' => 1,
                'prerequisite' => 'GE 1',
            ],
            [
                'program_id' => $programIds['BSTM'],
                'subject_id' => $subjectIds['HMPE 3'],
                'year_level' => 3,
                'semester' => 1,
                'prerequisite' => 'HMPE 1',
            ],
            [
                'program_id' => $programIds['BSTM'],
                'subject_id' => $subjectIds['BME 1'],
                'year_level' => 3,
                'semester' => 1,
                'prerequisite' => 'THC 1',
            ],
            [
                'program_id' => $programIds['BSTM'],
                'subject_id' => $subjectIds['THC 6'],
                'year_level' => 3,
                'semester' => 1,
                'prerequisite' => 'GE 6',
            ],
            [
                'program_id' => $programIds['BSTM'],
                'subject_id' => $subjectIds['THC 7'],
                'year_level' => 3,
                'semester' => 1,
                'prerequisite' => 'THC 1',
            ],

            // THIRD YEAR - Second Semester
            [
                'program_id' => $programIds['BSTM'],
                'subject_id' => $subjectIds['THC 8'],
                'year_level' => 3,
                'semester' => 2,
                'prerequisite' => 'THC 1/THC 2',
            ],
            [
                'program_id' => $programIds['BSTM'],
                'subject_id' => $subjectIds['GE ELECT 3'],
                'year_level' => 3,
                'semester' => 2,
                'prerequisite' => 'GE ELECT 2/TPC 3/GE 6',
            ],
            [
                'program_id' => $programIds['BSTM'],
                'subject_id' => $subjectIds['BME 2'],
                'year_level' => 3,
                'semester' => 2,
                'prerequisite' => 'THC 1',
            ],
            [
                'program_id' => $programIds['BSTM'],
                'subject_id' => $subjectIds['HMPE 4'],
                'year_level' => 3,
                'semester' => 2,
                'prerequisite' => 'HMPE 3',
            ],
            [
                'program_id' => $programIds['BSTM'],
                'subject_id' => $subjectIds['THC 9'],
                'year_level' => 3,
                'semester' => 2,
                'prerequisite' => 'THC 4',
            ],
            [
                'program_id' => $programIds['BSTM'],
                'subject_id' => $subjectIds['GE ELECT 5'],
                'year_level' => 3,
                'semester' => 2,
                'prerequisite' => 'THC 1',
            ],
            [
                'program_id' => $programIds['BSTM'],
                'subject_id' => $subjectIds['TPC 7'],
                'year_level' => 3,
                'semester' => 2,
                'prerequisite' => 'THC 1/THC 2',
            ],

            // FOURTH YEAR - First Semester
            [
                'program_id' => $programIds['BSTM'],
                'subject_id' => $subjectIds['HMPE 5'],
                'year_level' => 4,
                'semester' => 1,
                'prerequisite' => 'HMPE 2',
            ],
            [
                'program_id' => $programIds['BSTM'],
                'subject_id' => $subjectIds['RIZAL'],
                'year_level' => 4,
                'semester' => 1,
                
            ],
            [
                'program_id' => $programIds['BSTM'],
                'subject_id' => $subjectIds['TPC 9'],
                'year_level' => 4,
                'semester' => 1,
                'prerequisite' => 'TPC 6',
            ],
            [
                'program_id' => $programIds['BSTM'],
                'subject_id' => $subjectIds['TPC 10'],
                'year_level' => 4,
                'semester' => 1,
                'prerequisite' => 'GE ELECT 4',
            ],
            [
                'program_id' => $programIds['BSTM'],
                'subject_id' => $subjectIds['THC 10'],
                'year_level' => 4,
                'semester' => 1,
                'prerequisite' => 'THC 1/GE ELECT 5',
            ],
            [
                'program_id' => $programIds['BSTM'],
                'subject_id' => $subjectIds['GE 8'],
                'year_level' => 4,
                'semester' => 1,
                
            ],

            // FOURTH YEAR - Second Semester
            [
                'program_id' => $programIds['BSTM'],
                'subject_id' => $subjectIds['PRACTICUM'],
                'year_level' => 4,
                'semester' => 2,
                'prerequisite' => 'Finished all Academic Requirements',
            ],


            //  ---------------- BSHM ----------------

            // FIRST YEAR - First Semester
            [
                'program_id' => $programIds['BSHM'],
                'subject_id' => $subjectIds['GE 1'],
                'year_level' => 1,
                'semester' => 1,
                
            ],
            [
                'program_id' => $programIds['BSHM'],
                'subject_id' => $subjectIds['GE 2'],
                'year_level' => 1,
                'semester' => 1,
                
            ],
            [
                'program_id' => $programIds['BSHM'],
                'subject_id' => $subjectIds['GE 3'],
                'year_level' => 1,
                'semester' => 1,
                
            ],
            [
                'program_id' => $programIds['BSHM'],
                'subject_id' => $subjectIds['THC 1'],
                'year_level' => 1,
                'semester' => 1,
                
            ],
            [
                'program_id' => $programIds['BSHM'],
                'subject_id' => $subjectIds['THC 2'],
                'year_level' => 1,
                'semester' => 1,
                
            ],
            [
                'program_id' => $programIds['BSHM'],
                'subject_id' => $subjectIds['PATHFit 1'],
                'year_level' => 1,
                'semester' => 1,
                
            ],
            [
                'program_id' => $programIds['BSHM'],
                'subject_id' => $subjectIds['NSTP 1'],
                'year_level' => 1,
                'semester' => 1,
                
            ],

            // FIRST YEAR - Second Semester
            [
                'program_id' => $programIds['BSHM'],
                'subject_id' => $subjectIds['THC 3'],
                'year_level' => 1,
                'semester' => 2,
                'prerequisite' => 'THC 2',
            ],
            [
                'program_id' => $programIds['BSHM'],
                'subject_id' => $subjectIds['THC 4'],
                'year_level' => 1,
                'semester' => 2,
                'prerequisite' => 'THC 1',
            ],
            [
                'program_id' => $programIds['BSHM'],
                'subject_id' => $subjectIds['THC 5'],
                'year_level' => 1,
                'semester' => 2,
                'prerequisite' => 'THC 1',
            ],
            [
                'program_id' => $programIds['BSHM'],
                'subject_id' => $subjectIds['HPC 1'],
                'year_level' => 1,
                'semester' => 2,
                'prerequisite' => 'THC 2',
            ],
            [
                'program_id' => $programIds['BSHM'],
                'subject_id' => $subjectIds['HPC 2'],
                'year_level' => 1,
                'semester' => 2,
                'prerequisite' => 'THC 1',
            ],
            [
                'program_id' => $programIds['BSHM'],
                'subject_id' => $subjectIds['PATHFit 2'],
                'year_level' => 1,
                'semester' => 2,
                'prerequisite' => 'PATHFit 1',
            ],
            [
                'program_id' => $programIds['BSHM'],
                'subject_id' => $subjectIds['NSTP 2'],
                'year_level' => 1,
                'semester' => 2,
                'prerequisite' => 'NSTP 1',
            ],

            // SECOND YEAR - First Semester
            [
                'program_id' => $programIds['BSHM'],
                'subject_id' => $subjectIds['GE 4'],
                'year_level' => 2,
                'semester' => 1,
                
            ],
            [
                'program_id' => $programIds['BSHM'],
                'subject_id' => $subjectIds['GE ELECT 1'],
                'year_level' => 2,
                'semester' => 1,
                'prerequisite' => 'GE 2',
            ],
            [
                'program_id' => $programIds['BSHM'],
                'subject_id' => $subjectIds['HPC 3'],
                'year_level' => 2,
                'semester' => 1,
                
            ],
            [
                'program_id' => $programIds['BSHM'],
                'subject_id' => $subjectIds['HPC 4'],
                'year_level' => 2,
                'semester' => 1,
                'prerequisite' => 'THC 3',
            ],
            [
                'program_id' => $programIds['BSHM'],
                'subject_id' => $subjectIds['HPC 5'],
                'year_level' => 2,
                'semester' => 1,
                
            ],
            [
                'program_id' => $programIds['BSHM'],
                'subject_id' => $subjectIds['PATHFit 3'],
                'year_level' => 2,
                'semester' => 1,
                'prerequisite' => 'PATHFit 2',
            ],
            [
                'program_id' => $programIds['BSHM'],
                'subject_id' => $subjectIds['GE 5'],
                'year_level' => 2,
                'semester' => 1,
                'prerequisite' => 'GE 4',
            ],

            // SECOND YEAR - Second Semester
            [
                'program_id' => $programIds['BSHM'],
                'subject_id' => $subjectIds['GE 6'],
                'year_level' => 2,
                'semester' => 2,
                'prerequisite' => 'GE ELECT 1',
            ],
            [
                'program_id' => $programIds['BSHM'],
                'subject_id' => $subjectIds['GE 7'],
                'year_level' => 2,
                'semester' => 2,
                'prerequisite' => 'GE ELECT 1',
            ],
            [
                'program_id' => $programIds['BSHM'],
                'subject_id' => $subjectIds['HPC 6'],
                'year_level' => 2,
                'semester' => 2,
                'prerequisite' => 'HPC 1',
            ],
            [
                'program_id' => $programIds['BSHM'],
                'subject_id' => $subjectIds['HPC 7'],
                'year_level' => 2,
                'semester' => 2,
                'prerequisite' => 'THC 5',
            ],
            [
                'program_id' => $programIds['BSHM'],
                'subject_id' => $subjectIds['HMPE 1'],
                'year_level' => 2,
                'semester' => 2,
                
            ],
            [
                'program_id' => $programIds['BSHM'],
                'subject_id' => $subjectIds['HPC 8'],
                'year_level' => 2,
                'semester' => 2,
                'prerequisite' => 'HPC 5',
            ],
            [
                'program_id' => $programIds['BSHM'],
                'subject_id' => $subjectIds['PATHFit 4'],
                'year_level' => 2,
                'semester' => 2,
                'prerequisite' => 'PATHFit 3',
            ],

            // THIRD YEAR - First Semester
            [
                'program_id' => $programIds['BSHM'],
                'subject_id' => $subjectIds['GE 8'],
                'year_level' => 3,
                'semester' => 1,
                'prerequisite' => 'GE ELECT 1',
            ],
            [
                'program_id' => $programIds['BSHM'],
                'subject_id' => $subjectIds['HMPE 2'],
                'year_level' => 3,
                'semester' => 1,
                'prerequisite' => 'HPC 6',
            ],
            [
                'program_id' => $programIds['BSHM'],
                'subject_id' => $subjectIds['HMPE 3'],
                'year_level' => 3,
                'semester' => 1,
                'prerequisite' => 'THC 5',
            ],
            [
                'program_id' => $programIds['BSHM'],
                'subject_id' => $subjectIds['BME 1'],
                'year_level' => 3,
                'semester' => 1,
                'prerequisite' => 'TPC 3',
            ],
            [
                'program_id' => $programIds['BSHM'],
                'subject_id' => $subjectIds['THC 6'],
                'year_level' => 3,
                'semester' => 1,
                'prerequisite' => 'GE 6',
            ],
            [
                'program_id' => $programIds['BSHM'],
                'subject_id' => $subjectIds['THC 7'],
                'year_level' => 3,
                'semester' => 1,
                'prerequisite' => 'TPC 3',
            ],
            [
                'program_id' => $programIds['BSHM'],
                'subject_id' => $subjectIds['HPC 10'],
                'year_level' => 3,
                'semester' => 1,
                'prerequisite' => 'GE 1',
            ],

            // THIRD YEAR - Second Semester
            [
                'program_id' => $programIds['BSHM'],
                'subject_id' => $subjectIds['BME 2'],
                'year_level' => 3,
                'semester' => 2,
                'prerequisite' => 'BME 1',
            ],
            [
                'program_id' => $programIds['BSHM'],
                'subject_id' => $subjectIds['THC 8'],
                'year_level' => 3,
                'semester' => 2,
                'prerequisite' => 'HMPE 2',
            ],
            [
                'program_id' => $programIds['BSHM'],
                'subject_id' => $subjectIds['THC 9'],
                'year_level' => 3,
                'semester' => 2,
                'prerequisite' => 'BME 1',
            ],
            [
                'program_id' => $programIds['BSHM'],
                'subject_id' => $subjectIds['THC 10'],
                'year_level' => 3,
                'semester' => 2,
                'prerequisite' => 'BME 1',
            ],
            [
                'program_id' => $programIds['BSHM'],
                'subject_id' => $subjectIds['GE ELECT 5'],
                'year_level' => 3,
                'semester' => 2,
                'prerequisite' => 'BME 1',
            ],
            [
                'program_id' => $programIds['BSHM'],
                'subject_id' => $subjectIds['HPC 9'],
                'year_level' => 3,
                'semester' => 2,
                'prerequisite' => 'BME 1',
            ],
            [
                'program_id' => $programIds['BSHM'],
                'subject_id' => $subjectIds['HMPE 4'],
                'year_level' => 3,
                'semester' => 2,
                'prerequisite' => 'HMPE 1',
            ],

            // FOURTH YEAR - First Semester
            [
                'program_id' => $programIds['BSHM'],
                'subject_id' => $subjectIds['HMPE 5'],
                'year_level' => 4,
                'semester' => 1,
                'prerequisite' => 'HPC 1',
            ],
            [
                'program_id' => $programIds['BSHM'],
                'subject_id' => $subjectIds['RIZAL'],
                'year_level' => 4,
                'semester' => 1,
                
            ],
            [
                'program_id' => $programIds['BSHM'],
                'subject_id' => $subjectIds['GE ELECT 2'],
                'year_level' => 4,
                'semester' => 1,
                'prerequisite' => 'GE 5',
            ],
            [
                'program_id' => $programIds['BSHM'],
                'subject_id' => $subjectIds['GE ELECT 3'],
                'year_level' => 4,
                'semester' => 1,
                'prerequisite' => 'GE 4',
            ],
            [
                'program_id' => $programIds['BSHM'],
                'subject_id' => $subjectIds['GE 9'],
                'year_level' => 4,
                'semester' => 1,
                
            ],

            // FOURTH YEAR - Second Semester
            [
                'program_id' => $programIds['BSHM'],
                'subject_id' => $subjectIds['PRACTICUM'],
                'year_level' => 4,
                'semester' => 2,
                'prerequisite' => 'Finished all Academic Requirements',
            ],


            // ---------------- BSE ----------------
            // FIRST YEAR - First Semester
            [
                'program_id' => $programIds['BSE'],
                'subject_id' => $subjectIds['GE 1'],
                'year_level' => 1,
                'semester' => 1,
                
            ],
            [
                'program_id' => $programIds['BSE'],
                'subject_id' => $subjectIds['GE 2'],
                'year_level' => 1,
                'semester' => 1,
                
            ],
            [
                'program_id' => $programIds['BSE'],
                'subject_id' => $subjectIds['GE 3'],
                'year_level' => 1,
                'semester' => 1,
                
            ],
            [
                'program_id' => $programIds['BSE'],
                'subject_id' => $subjectIds['ENT 1'],
                'year_level' => 1,
                'semester' => 1,
                
            ],
            [
                'program_id' => $programIds['BSE'],
                'subject_id' => $subjectIds['MGT 1'],
                'year_level' => 1,
                'semester' => 1,
                
            ],
            [
                'program_id' => $programIds['BSE'],
                'subject_id' => $subjectIds['PATHFit 1'],
                'year_level' => 1,
                'semester' => 1,
                
            ],
            [
                'program_id' => $programIds['BSE'],
                'subject_id' => $subjectIds['NSTP 1'],
                'year_level' => 1,
                'semester' => 1,
                
            ],

            // FIRST YEAR - Second Semester
            [
                'program_id' => $programIds['BSE'],
                'subject_id' => $subjectIds['GE 4'],
                'year_level' => 1,
                'semester' => 2,
                
            ],
            [
                'program_id' => $programIds['BSE'],
                'subject_id' => $subjectIds['ENT 2'],
                'year_level' => 1,
                'semester' => 2,
                'prerequisite' => 'ENT 1',
            ],
            [
                'program_id' => $programIds['BSE'],
                'subject_id' => $subjectIds['MKG 1'],
                'year_level' => 1,
                'semester' => 2,
                'prerequisite' => 'MGT 1',
            ],
            [
                'program_id' => $programIds['BSE'],
                'subject_id' => $subjectIds['GE 5'],
                'year_level' => 1,
                'semester' => 2,
                
            ],
            [
                'program_id' => $programIds['BSE'],
                'subject_id' => $subjectIds['GE 6'],
                'year_level' => 1,
                'semester' => 2,
                
            ],
            [
                'program_id' => $programIds['BSE'],
                'subject_id' => $subjectIds['PATHFit 2'],
                'year_level' => 1,
                'semester' => 2,
                'prerequisite' => 'PATHFit 1',
            ],
            [
                'program_id' => $programIds['BSE'],
                'subject_id' => $subjectIds['NSTP 2'],
                'year_level' => 1,
                'semester' => 2,
                'prerequisite' => 'NSTP 1',
            ],

            // SECOND YEAR - First Semester
            [
                'program_id' => $programIds['BSE'],
                'subject_id' => $subjectIds['GE 7'],
                'year_level' => 2,
                'semester' => 1,
                
            ],
            [
                'program_id' => $programIds['BSE'],
                'subject_id' => $subjectIds['GE 8'],
                'year_level' => 2,
                'semester' => 1,
                
            ],
            [
                'program_id' => $programIds['BSE'],
                'subject_id' => $subjectIds['ENT 3'],
                'year_level' => 2,
                'semester' => 1,
                'prerequisite' => 'ENT 2',
            ],
            [
                'program_id' => $programIds['BSE'],
                'subject_id' => $subjectIds['ENT 4'],
                'year_level' => 2,
                'semester' => 1,
                'prerequisite' => 'MKG 1/ENT 3',
            ],
            [
                'program_id' => $programIds['BSE'],
                'subject_id' => $subjectIds['GE ELECT 1'],
                'year_level' => 2,
                'semester' => 1,
                
            ],
            [
                'program_id' => $programIds['BSE'],
                'subject_id' => $subjectIds['ACCTG 1'],
                'year_level' => 2,
                'semester' => 1,
                
            ],
            [
                'program_id' => $programIds['BSE'],
                'subject_id' => $subjectIds['PATHFit 3'],
                'year_level' => 2,
                'semester' => 1,
                'prerequisite' => 'PATHFit 2',
            ],

            // SECOND YEAR - Second Semester
            [
                'program_id' => $programIds['BSE'],
                'subject_id' => $subjectIds['GE ELECT 2'],
                'year_level' => 2,
                'semester' => 2,
                'prerequisite' => 'GE ELECT 1',
            ],
            [
                'program_id' => $programIds['BSE'],
                'subject_id' => $subjectIds['ENT 5'],
                'year_level' => 2,
                'semester' => 2,
                'prerequisite' => 'ENT 4',
            ],
            [
                'program_id' => $programIds['BSE'],
                'subject_id' => $subjectIds['ENT 6'],
                'year_level' => 2,
                'semester' => 2,
                'prerequisite' => 'ENT 4/ENT 5',
            ],
            [
                'program_id' => $programIds['BSE'],
                'subject_id' => $subjectIds['ENT 7'],
                'year_level' => 2,
                'semester' => 2,
                'prerequisite' => 'ENT 1',
            ],
            [
                'program_id' => $programIds['BSE'],
                'subject_id' => $subjectIds['HRM'],
                'year_level' => 2,
                'semester' => 2,
                'prerequisite' => 'MGT 1/ENT 1',
            ],
            [
                'program_id' => $programIds['BSE'],
                'subject_id' => $subjectIds['ACCTG 2'],
                'year_level' => 2,
                'semester' => 2,
                'prerequisite' => 'ACCTG 1',
            ],
            [
                'program_id' => $programIds['BSE'],
                'subject_id' => $subjectIds['PATHFit 4'],
                'year_level' => 2,
                'semester' => 2,
                'prerequisite' => 'PATHFit 3',
            ],

            // THIRD YEAR - First Semester
            [
                'program_id' => $programIds['BSE'],
                'subject_id' => $subjectIds['ENT 8'],
                'year_level' => 3,
                'semester' => 1,
                'prerequisite' => 'ENT 7/ACCTG 2',
            ],
            [
                'program_id' => $programIds['BSE'],
                'subject_id' => $subjectIds['OM'],
                'year_level' => 3,
                'semester' => 1,
                'prerequisite' => 'MGT 1/HRM/ACCTG 2',
            ],
            [
                'program_id' => $programIds['BSE'],
                'subject_id' => $subjectIds['HUM 1'],
                'year_level' => 3,
                'semester' => 1,
                'prerequisite' => 'GE ELECT 2',
            ],
            [
                'program_id' => $programIds['BSE'],
                'subject_id' => $subjectIds['MOE 1'],
                'year_level' => 3,
                'semester' => 1,
                'prerequisite' => 'MKG 1',
            ],
            [
                'program_id' => $programIds['BSE'],
                'subject_id' => $subjectIds['ELT 1'],
                'year_level' => 3,
                'semester' => 1,
                'prerequisite' => 'MGT 1',
            ],
            [
                'program_id' => $programIds['BSE'],
                'subject_id' => $subjectIds['ELT 2'],
                'year_level' => 3,
                'semester' => 1,
                
            ],

            // THIRD YEAR - Second Semester
            [
                'program_id' => $programIds['BSE'],
                'subject_id' => $subjectIds['ENT 9'],
                'year_level' => 3,
                'semester' => 2,
                'prerequisite' => 'ENT 8',
            ],
            [
                'program_id' => $programIds['BSE'],
                'subject_id' => $subjectIds['STRAMA'],
                'year_level' => 3,
                'semester' => 2,
                'prerequisite' => 'OM',
            ],
            [
                'program_id' => $programIds['BSE'],
                'subject_id' => $subjectIds['MOE 2'],
                'year_level' => 3,
                'semester' => 2,
                'prerequisite' => 'MOE 1',
            ],
            [
                'program_id' => $programIds['BSE'],
                'subject_id' => $subjectIds['ELT 3'],
                'year_level' => 3,
                'semester' => 2,
                'prerequisite' => 'OM/ELT 1/ELT 2',
            ],
            [
                'program_id' => $programIds['BSE'],
                'subject_id' => $subjectIds['ELT 4'],
                'year_level' => 3,
                'semester' => 2,
                'prerequisite' => 'ENT 1',
            ],
            [
                'program_id' => $programIds['BSE'],
                'subject_id' => $subjectIds['MDA'],
                'year_level' => 3,
                'semester' => 2,
                'prerequisite' => 'MOE 1',
            ],

            // FOURTH YEAR - First Semester
            [
                'program_id' => $programIds['BSE'],
                'subject_id' => $subjectIds['LAW'],
                'year_level' => 4,
                'semester' => 1,
                'prerequisite' => 'ACCTG 2',
            ],
            [
                'program_id' => $programIds['BSE'],
                'subject_id' => $subjectIds['GE 9'],
                'year_level' => 4,
                'semester' => 1,
                'prerequisite' => 'GE ELECT 1',
            ],
            [
                'program_id' => $programIds['BSE'],
                'subject_id' => $subjectIds['ENT 10'],
                'year_level' => 4,
                'semester' => 1,
                'prerequisite' => 'ENT 9',
            ],
            [
                'program_id' => $programIds['BSE'],
                'subject_id' => $subjectIds['MIS'],
                'year_level' => 4,
                'semester' => 1,
                'prerequisite' => 'MOE 2',
            ],
            [
                'program_id' => $programIds['BSE'],
                'subject_id' => $subjectIds['ELT 5'],
                'year_level' => 4,
                'semester' => 1,
                'prerequisite' => 'ELT 4',
            ],

            // FOURTH YEAR - Second Semester
            [
                'program_id' => $programIds['BSE'],
                'subject_id' => $subjectIds['ENT 11'],
                'year_level' => 4,
                'semester' => 2,
                'prerequisite' => 'ENT 10',
            ],
            [
                'program_id' => $programIds['BSE'],
                'subject_id' => $subjectIds['ENT 12'],
                'year_level' => 4,
                'semester' => 2,
                'prerequisite' => 'OM/ELT 1/STRAMA',
            ],
            [
                'program_id' => $programIds['BSE'],
                'subject_id' => $subjectIds['ENT 13'],
                'year_level' => 4,
                'semester' => 2,
                
            ],
        ];
        //  if no prerequisite, set it to null
        foreach ($curriculumns as &$curriculum) {
            if (!isset($curriculum['prerequisite'])) {
                $curriculum['prerequisite'] = null;
            }else{
                $curriculum['prerequisite'] = $subjectIds[$curriculum['prerequisite']] ?? null;
            }

            Curriculum::create($curriculum);
        }
        
    }
}

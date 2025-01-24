export const ACCELERATION_SERVICES = {
    'Research Infrastructure': {
        'link': 'https://www.research.manchester.ac.uk/research-infrastructure',
        'description': 'Access world-class research facilities including our £400M Advanced Materials Research Centre, biomedical laboratories, and Digital Innovation Hub. Supporting cutting-edge research across multiple disciplines.',
        'subServices': {
            'Open Access Facilities': {
                'link': 'https://www.research.manchester.ac.uk/student-catalogue',
                'description': 'Access publicly available facilities including the National Graphene Institute, Manchester Institute of Biotechnology, and shared computing clusters.',
                'subServices': {}
            },
            'Restricted Access Facilities': {
                'link': 'https://www.research.manchester.ac.uk/funding-opportunities',
                'description': 'Exclusive access to specialized infrastructure for confidential projects, including clean rooms, secure data centers, and private laboratory spaces.',
                'subServices': {}
            }
        }
    },
    'Student Catalogue': {
        'link': 'https://www.research.manchester.ac.uk/student-catalogue',
        'description': 'Explore our database of over 5,000 student research projects and initiatives. Discover collaborative opportunities across all academic disciplines.',
        'subServices': {}
    },
    'Funding Opportunities': {
        'link': 'https://www.research.manchester.ac.uk/funding-opportunities',
        'description': 'Navigate through research funding opportunities worth over £200 million annually. Find grants, fellowships, and scholarships tailored to your research area.',
        'subServices': {
            'Local Funding': {
                'link': 'https://www.research.manchester.ac.uk/funding-opportunities',
                'description': 'Access regional funding through Greater Manchester Innovation Fund and Northern Powerhouse Investment Fund. Grants ranging from £10,000 to £500,000.',
                'subServices': {
                    'Enterprise Funding': {
                        'link': 'https://www.research.manchester.ac.uk/funding-opportunities',
                        'description': 'Connect with local business funding including SME Innovation Vouchers and Knowledge Transfer Partnerships.',
                        'subServices': {}
                    },
                    'Non-Profit Organizations': {
                        'link': 'https://www.research.manchester.ac.uk/funding-opportunities',
                        'description': 'Explore funding from Wellcome Trust North, Cancer Research UK Manchester Centre, and local healthcare trusts.',
                        'subServices': {
                            'Healthcare Trusts': {
                                'link': 'https://www.research.manchester.ac.uk/funding-opportunities',
                                'description': 'Access specialized funding for rare diseases, public health initiatives, and clinical trials in Greater Manchester.',
                                'subServices': {}
                            }
                        }
                    }
                }
            },
            'International Funding': {
                'link': 'https://www.research.manchester.ac.uk/funding-opportunities',
                'description': 'Access EU Horizon Europe grants, Global Challenges Research Fund, and Newton Fund partnerships. Funding from €50,000 to €5 million.',
                'subServices': {}
            },
            'Industry': {
                'link': 'https://www.research.manchester.ac.uk/funding-opportunities',
                'description': 'Industry-sponsored opportunities from global corporations including GSK, Siemens, and BP. Funding from £100,000 to £2 million per project.',
                'subServices': {}
            }
        }
    },
    "R&I Collaboration": {
        'link': 'https://www.research.manchester.ac.uk/r-i-collaboration',
        'description': 'Connect with our network of over 1,000 research partners across 100 countries through our dedicated partnership development team.',
        'subServices': {}
    },
    'Internships': {
        'link': 'https://www.research.manchester.ac.uk/internships',
        'description': 'Find research internship opportunities ranging from 8-week summer placements to year-long positions, with competitive stipends.',
        'subServices': {}
    },
    'Faculty and Staff': {
        'link': 'https://www.research.manchester.ac.uk/faculty-and-staff',
        'description': 'Resources and support services for 5,000+ academic staff and researchers. Access career development and research support.',
        'subServices': {
            'Academic Staff': {
                'link': 'https://www.research.manchester.ac.uk/faculty-and-staff',
                'description': 'Resources for 2,000+ faculty members, including research development support and leadership development opportunities.',
                'subServices': {
                    'Teaching Resources': {
                        'link': 'https://www.research.manchester.ac.uk/faculty-and-staff',
                        'description': 'Access teaching resources, departmental research strategies, and support for research group leadership.',
                        'subServices': {}
                    }
                }
            },
            'Professional Services': {
                'link': 'https://www.research.manchester.ac.uk/faculty-and-staff',
                'description': 'Resources for 3,000+ professional services staff, including administrative procedures and development opportunities.',
                'subServices': {
                    'Research Support': {
                        'link': 'https://www.research.manchester.ac.uk/faculty-and-staff',
                        'description': 'Support for research staff including funding opportunities and career development programs.',
                        'subServices': {}
                    },
                    'Operations': {
                        'link': 'https://www.research.manchester.ac.uk/faculty-and-staff',
                        'description': 'Resources for managing research projects, including grant management and compliance guidelines.',
                        'subServices': {
                            'Research Management': {
                                'link': 'https://www.research.manchester.ac.uk/faculty-and-staff',
                                'description': 'Guidance for research administration including award management and ethical approval processes.',
                                'subServices': {}
                            },
                        }
                    }
                }
            }
        }
    },
    'Stakeholders': {
        'link': 'https://www.research.manchester.ac.uk/stakeholders',
        'description': 'Connect with industrial partners, government agencies, and community organizations. Access partnership opportunities and engagement initiatives.',
        'subServices': {}
    },
    'Projects': {
        'link': 'https://www.research.manchester.ac.uk/projects',
        'description': 'Explore our portfolio of 2,000+ active research projects addressing global challenges across all academic disciplines.',
        'subServices': {
            'Active Projects': {
                'link': 'https://www.research.manchester.ac.uk/projects',
                'description': 'Browse 1,200+ current projects worth over £500 million. Find collaboration opportunities and engage with research teams.',
                'subServices': {}
            },
            'Project Archive': {
                'link': 'https://www.research.manchester.ac.uk/projects',
                'description': 'Access our archive of 5,000+ completed projects, including outcomes, impact statements, and published findings.',
                'subServices': {}
            }
        }
    }
}

export const STRUCTURED_DATA = {
    'Sudent Services': {
        'description': 'Unite! offerings and activities open to students enrolled in any of the nine Unite! partner universities',
        'showcase': '',
        'subServices': [],
        'catalogues': [
            {
                'name': 'Student Catalogue',
                'description': 'Explore our database of over 5,000 student research projects and initiatives. Discover collaborative opportunities across all academic disciplines.',
                'models': [
                    {
                        'name': 'Course Catalogue',
                        'model': 'student.course',
                    },
                    {
                        'name': 'Extracurricular Activity Catalogue',
                        'model': 'student.extra.activity',
                    },
                    {
                        'name': 'Joint Programmes Catalogue',
                        'model': 'student.jp',
                    },
                    {
                        'name': 'MOOCs Catalogue',
                        'model': 'student.mooc',
                    }
                ],
                'websites': [
                    {
                        'view_name': 'Course',
                        'page_url': 'https://agora.unite-university.eu/student-catalogue/course',
                    },
                    {
                        'view_name': 'Extracurricular Activity',
                        'page_url': 'https://agora.unite-university.eu/student-catalogue/extra-act',
                    },
                    {
                        'view_name': 'Joint Programmes',
                        'page_url': 'https://agora.unite-university.eu/student-catalogue/jp',
                    },
                    {
                        'view_name': 'MOOCs',
                        'page_url': 'https://agora.unite-university.eu/student-catalogue/mooc',
                    }
                ]
            }
        ]
    },
    'Faculty & Staff Community Platform': {
        'description': 'Digital platform for Faculty & Staff members of Unite!',
        'showcase': 'https://facultyandstaff.unite-university.eu/',
        'subServices': [
            {
                'name': 'Training Catalogue',
                'description': 'Faculty and Staff Trainings catalogue.',
                'showcase': 'https://agora.unite-university.eu/faculty-and-staff-training-catalogue',
                'subServices': [],
                'catalogues': [
                    {
                        'name': 'Training Catalogue',
                        'description': 'Access trainings and courses offered by Unite!',
                        'models': [
                            {
                                'name': 'Certifications',
                                'model': 'staff.course.certification',
                            },
                            {
                                'name': 'Course Language',
                                'model': 'staff.course.language',
                            },
                            {
                                'name': 'Course Modality',
                                'model': 'staff.course.modality',
                            },
                            {
                                'name': 'Course Public',
                                'model': 'staff.course.public',
                            },
                            {
                                'name': 'Course Topic',
                                'model': 'staff.course.topic',
                            },
                            {
                                'name': 'Faculty & Staff Courses',
                                'model': 'staff.course',
                            },
                            {
                                'name': 'Organising Partner',
                                'model': 'staff.course.partner',
                            }
                        ],
                        'websites': [
                            {
                                'view_name': 'Trainings',
                                'page_url': 'https://agora.unite-university.eu/resources/trainings',
                            },
                            {
                                'view_name': 'Documentation',
                                'page_url': 'https://agora.unite-university.eu/resources/documentation',
                            }
                            
                        ]
                    }
                ]
            },
            {
                'name': 'Academic Staff',
                'description': 'Resources for 2,000+ faculty members, including research development support and leadership development opportunities.',
                'showcase': '',
                'subServices': [],
                'catalogues': [
                    {
                        'name': 'Training Catalogue',
                        'description': 'Access trainings and courses offered by Unite!',
                        'models': [
                            {
                                'name': 'Certifications',
                                'model': 'staff.course.certification',
                            },
                            {
                                'name': 'Course Language',
                                'model': 'staff.course.language',
                            },
                            {
                                'name': 'Course Modality',
                                'model': 'staff.course.modality',
                            },
                            {
                                'name': 'Course Public',
                                'model': 'staff.course.public',
                            },
                            {
                                'name': 'Course Topic',
                                'model': 'staff.course.topic',
                            },
                            {
                                'name': 'Faculty & Staff Courses',
                                'model': 'staff.course',
                            },
                            {
                                'name': 'Organising Partner',
                                'model': 'staff.course.partner',
                            }
                        ],
                        'websites': [
                            {
                                'view_name': 'Staff Members',
                                'page_url': 'https://agora.unite-university.eu/resources/staff-members',
                            }
                            
                        ]
                    }
                ]
            },
        ],
        'catalogues': []
    },
    'Research Infrastructure': {
        'description': 'Access world-class research facilities including our £400M Advanced Materials Research Centre, biomedical laboratories, and Digital Innovation Hub. Supporting cutting-edge research across multiple disciplines.',
        'showcase': '',
        'subServices': [],
        'catalogues': [
            {
                'name': 'Research Infrastructure Catalogue',
                'description': 'Access our catalogue of world-class research facilities including our £400M Advanced Materials Research Centre, biomedical laboratories, and Digital Innovation Hub. Supporting cutting-edge research across multiple disciplines.',
                'models': [
                    {
                        'name': 'Infrastructures',
                        'model': 'resources.infrastructure',
                    }
                ],
                'websites': [
                    {
                        'view_name': 'Available Infrastructures',
                        'page_url': 'https://agora.unite-university.eu/resources/infrastructure',
                    }
                ]
            }
        ]
    },
    'Speech Language and AI': {
        'description': 'Unite! is a leading provider of speech language and AI research and development. Unite! is committed to advancing the state of the art in speech language and AI research and development.',
        'showcase': 'https://agora.unite-university.eu/speech-language-and-ai',
        'subServices': [],
        'catalogues': []
    },
    'Welcome Inclusion and Wellbeing': {
        'description': 'Unite! is committed to creating a welcoming and inclusive environment for all members of the Unite! community.',
        'showcase': 'https://agora.unite-university.eu/welcome-inclusion-and-wellbeing',
        'subServices': [],
        'catalogues': []
    },
}

export const LLM_QUERY_RESPONSE_LONG = {'data': [
        {
            'type': 'student.course',
            'items': [
                {
                    "id": 3,
                    "fields": {
                      "name": "ULISSES Project – Oceans without plastic",
                      "lead": "{'name': 'ULISSES', 'id': 10861, 'model': 'crm.lead'}",
                      "contact_person": "{'name': 'Luís Tinoca', 'id': 44992, 'model': 'res.partner'}",
                      "validated": "True",
                      "id": "3",
                      "__last_update": "2025-01-14 14:30:44.513901",
                      "display_name": "ULISSES Project – Oceans without plastic",
                      "create_uid": "{'name': 'Alba Roma', 'id': 19, 'model': 'res.users'}",
                      "create_date": "2024-06-10 15:26:52.660901",
                      "write_uid": "{'name': 'Alba Roma', 'id': 19, 'model': 'res.users'}",
                      "write_date": "2025-01-14 14:30:44.513901",
                      "summary": "Application period extended! The ULISSES Project is a comprehensive course designed to provide students with a multidisciplinary education focused on ocean sciences, sustainability, and innovative technological solutions. The Ulisses project provides interdisciplinary knowledge combining different STEM areas to promote the development of innovative solutions to ocean sustainability issues. University of Lisbon Interdisciplinary Studies on Sustainable Environment and Seas aims to raise awareness among students and society, favouring a deeper understanding of issues related to the oceans.   The initiative is aimed at university students who are looking to take part in an interdisciplinary and international project, who want to deepen their knowledge of the ocean and its importance for the sustainability of the planet, and who are looking to explore different career prospects. It will take place over several weeks, with an online component between January and April 2025, and a face-to-face component in Lisbon from 7 to 25 July 2025.   The selected students will take part in an international team and, supported by researchers and experts, will be challenged to design the most innovative solution to the problems facing the oceans in a collaborative environment.   The winning team in the last edition designed a scientific project that precisely addressed the three main objectives of the challenge. Firstly, they identified the technological resources and communication strategies essential for mapping the area affected by the incident described in the challenge. Next, they analysed the biodiversity of the impacted region, presenting a list of species at high risk and developing a detailed monitoring plan to assess the impacts over time. Finally, they proposed two innovative solutions to reduce plastic pollution in the oceans. Ulisses is a Blended Intensive Programme (BIP) funded under Erasmus+ KA131.  It consists of an intensive learning programme, offered by three partner institutions, combining virtual learning activities with physical mobility activities. ULisboa will be the receiving institution, where the learning activities during the physical mobility will occur. Universitat Politècnica de Catalunya  and Technische Universität Darmstadt are partner institutions, collaborating in the teaching and sending students in mobility. Notwithstanding, students from other institutions are welcome to apply.",
                      "field_of_study": "Interdisciplinary, science, engineering",
                      "academic_cycle": "[{'name': \"Bachelor's\", 'id': 1, 'model': 'unite.academic.cycle'}, {'name': \"Master's\", 'id': 2, 'model': 'unite.academic.cycle'}]",
                      "start_date": "2025-01-27",
                      "end_date": "2025-07-25",
                      "beginning_application_period": "2025-01-16",
                      "end_application_period": "2024-12-15",
                      "university_origin": "{'name': 'ULisboa', 'id': 6, 'model': 'research.internship.university'}",
                      "programme_manager": "Luís Tinoca",
                      "language_offered": "English",
                      "credits": "6",
                      "format": "{'name': 'Blended (Bips)', 'id': 3, 'model': 'unite.course.modality'}",
                      "tuition_fees": "None",
                      "link": "https://ulisses.ulisboa.pt/",
                      "applications": "False",
                      "image": "/web/image?model=student.course&id=3&field=image",
                      "featured": "True",
                      "x_editors": "[]"
                    }
                },
                {
                    "id": 4,
                    "fields": {
                      "name": "Energy System Transformation: The Impact of Electrification",
                      "lead": "{'name': '\"Energy System Transformation: The Impact of Electrification\"', 'id': 15784, 'model': 'crm.lead'}",
                      "contact_person": "{'name': 'Yingfang He', 'id': 44355, 'model': 'res.partner'}",
                      "validated": "False",
                      "id": "4",
                      "__last_update": "2025-01-14 14:30:48.800293",
                      "display_name": "Energy System Transformation: The Impact of Electrification",
                      "create_uid": "{'name': 'Antoni Bote Ribalta', 'id': 119, 'model': 'res.users'}",
                      "create_date": "2024-06-19 08:58:45.818732",
                      "write_uid": "{'name': 'Alba Roma', 'id': 19, 'model': 'res.users'}",
                      "write_date": "2025-01-14 14:30:48.800293",
                      "summary": "The yearly 2-week Energy PhD school organized by KTH Stockholm and TU Eindhoven will take place between 19-30 August 2024. The theme of the PhD school this year is: \"Energy System Transformation: The Impact of Electrification\" Students will have a schedule with lectures and project work in an international working environment where students from European Universities as well as Chinese Universities will participate.  Selected lectures will be given by expert Professors from Shanghai Jiao Tong University, Zhejiang University, KTH Royal Institute of Technology and TU Eindhoven on topics encompassing resilient production and storage, renewable energy technology, sustainability, energy demand flexibility and energy grids and conversion.",
                      "field_of_study": "Energy Engineering",
                      "academic_cycle": "{'name': 'Doctoral', 'id': 3, 'model': 'unite.academic.cycle'}",
                      "start_date": "2024-08-19",
                      "end_date": "2024-08-30",
                      "beginning_application_period": "2024-05-01",
                      "end_application_period": "2024-06-30",
                      "university_origin": "{'name': 'KTH', 'id': 5, 'model': 'research.internship.university'}",
                      "programme_manager": "Yingfang He",
                      "language_offered": "English",
                      "credits": "3",
                      "format": "{'name': 'Physical', 'id': 1, 'model': 'unite.course.modality'}",
                      "tuition_fees": "None",
                      "link": "https://www.energy.kth.se/seeep-phd-summer-school-2024-1.1171885",
                      "applications": "False",
                      "image": "/web/image?model=student.course&id=4&field=image",
                      "featured": "True",
                      "x_editors": "[]"
                    }
                }
            ]
        },
        {
            'type': 'student.mooc',
            'items': [
                {
                    "id": 2,
                    "fields": {
                      "name": "Open Educational Resources (OER) in Higher Education (MOOC)",
                      "lead": "{'name': ' Open Educational Resources (OER) in Higher Education (MOOC)', 'id': 11188, 'model': 'crm.lead'}",
                      "contact_person": "{'name': 'Schön, Sandra', 'id': 374, 'model': 'res.partner'}",
                      "validated": "True",
                      "id": "2",
                      "__last_update": "2024-11-13 15:47:54.672182",
                      "display_name": "Open Educational Resources (OER) in Higher Education (MOOC)",
                      "create_uid": "{'name': 'Antoni Bote Ribalta', 'id': 119, 'model': 'res.users'}",
                      "create_date": "2024-07-29 08:52:38.095655",
                      "write_uid": "{'name': 'Melissa Georgiou', 'id': 115, 'model': 'res.users'}",
                      "write_date": "2024-11-13 15:47:54.672182",
                      "summary": "Familiarise yourself with the background and potential of OER, and understand how to use materials with open licenses in a copyright-compliant manner. You’ll learn how to find and publish OER, as well as familiarise yourself with, and apply, open Creative Commons licenses, including CC-0, CC-BY, and CC BY-4.0.",
                      "field_of_study": "Educational Technology",
                      "academic_cycle": "[{'name': \"Bachelor's\", 'id': 1, 'model': 'unite.academic.cycle'}, {'name': \"Master's\", 'id': 2, 'model': 'unite.academic.cycle'}, {'name': 'Doctoral', 'id': 3, 'model': 'unite.academic.cycle'}]",
                      "start_date": "2024-05-06",
                      "end_date": "2024-10-31",
                      "university_origin": "{'name': 'TU Graz', 'id': 3, 'model': 'research.internship.university'}",
                      "programme_manager": "Sandra Schön",
                      "language_offered": "English, Catalan, Finnish, Swedish, French, Italian, Portugese, Polish and more.",
                      "format": "{'name': 'Virtual', 'id': 2, 'model': 'unite.course.modality'}",
                      "tuition_fees": "None",
                      "link": "https://imoox.at/course/OERinHE?lang=en",
                      "applications": "False",
                      "image": "/web/image?model=student.mooc&id=2&field=image",
                      "featured": "False",
                      "x_editors": "[]"
                    }
                }
            ]
        },
        {
            'type': 'funding.opportunities',
            'items': [
                {
                    "id": 4482,
                    "fields": {
                      "name": "Support to the Ministry of Public Administration and Local Self-Government in modernizing the personnel planning procedure for State Administration and harmonizing the Catalogue of titles in State administration and Local Self-Governments",
                      "type": "{'name': 'Calls for proposals', 'id': 3, 'model': 'funding.opportunities.type'}",
                      "reference": "172802PROSPECTSEN",
                      "division": "[]",
                      "framework": "{'name': 'EU External Action (RELEX)', 'id': 2, 'model': 'funding.opportunities.framework'}",
                      "period": "[{'name': '2014 - 2020', 'id': 1, 'model': 'funding.opportunities.period'}, {'name': '2021 - 2027', 'id': 2, 'model': 'funding.opportunities.period'}]",
                      "description": "",
                      "status": "{'name': 'Open for submission', 'id': 4, 'model': 'funding.opportunities.status'}",
                      "start": "2021-07-30 12:00:00",
                      "deadline": "False",
                      "url": "https://ec.europa.eu/info/funding-tenders/opportunities/data/topicDetails/172802EN",
                      "budget": "250000.0",
                      "summary": "Support to the Ministry of Public Administration and Local Self-Government in modernizing the personnel planning procedure for State Administration and harmonizing the Catalogue of titles in State administration and Local Self-Governments",
                      "id": "4482",
                      "__last_update": "2024-06-04 16:27:01.615787",
                      "display_name": "Support to the Ministry of Public Administration and Local Self-Government in modernizing the personnel planning procedure for State Administration and harmonizing the Catalogue of titles in State administration and Local Self-Governments",
                      "create_uid": "{'name': 'Antoni Bote Ribalta', 'id': 119, 'model': 'res.users'}",
                      "create_date": "2024-06-04 16:27:01.615787",
                      "write_uid": "{'name': 'Antoni Bote Ribalta', 'id': 119, 'model': 'res.users'}",
                      "write_date": "2024-06-04 16:27:01.615787"
                    }
                }
            ]
        }
]}

export const LLM_QUERY_RESPONSE_MEDIUM = {

}

export const LLM_QUERY_RESPONSE_SHORT = {

}

export const LLM_CHAT_HISTORY = [
    {
        message: `
            Certainly! I'll search our university alliance database for recent publications and 
            research on environmental sustainability. Could you specify your focus? Are you interested in courses or MOOCs?
        `, 
        result: null
    },
    {
        message: "Great focus. I've found several relevant resources", 
        result: [
            {
                service: 'Research Infrastructures',
                model: 'resources.infrastructure',
                element_ids: [491, 506, 507],
                featured_fields: [
                    'university_origin',
                ]
            },
            {
                service: 'Student Catalogue',
                model: 'student.course',
                element_ids: [4],
                featured_fields: [
                    'university_origin',
                    'start_date',
                    'end_date'
                ]
            },
            {
                service: 'Student Catalogue',
                model: 'student.mooc',
                element_ids: [3],
                featured_fields: [
                    'university_origin',
                    'start_date',
                    'end_date'
                ]
            },
            {
                service: 'Student Catalogue',
                model: 'student.jp',
                element_ids: [8],
                featured_fields: [
                    'university_origin',
                    'start_date',
                    'end_date'
                ]
            }
            
        ]
    },
    {
        message: "You're welcome. I'm here to help you with any further questions you might have.", 
        result: null
    }
]


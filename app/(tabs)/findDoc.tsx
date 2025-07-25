import React, {
    useCallback,
    useEffect,
    useMemo,
    useReducer,
    useState,
} from "react";
import {
    ActivityIndicator,
    Dimensions,
    FlatList,
    Image,
    Modal,
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
// import { Picker } from '@react-native-picker/picker'; // Removed as it's not used
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

import { useNavigation, useRoute } from "@react-navigation/native";

const { width: screenWidth } = Dimensions.get("window");

// Default user image - you'll need to add this to your assets
// Corrected path assumption. Adjust if your asset path is different (e.g., from an alias @/)
// Update the path below to the correct relative path where your image exists, e.g.:
// Use a placeholder image from the web since the local image is missing
const defaultUser = { uri: "https://reactnative.dev/img/tiny_logo.png" };

// API URL constant
// NOTE: In a real application, this should be moved to an environment variable (.env)
const GET_DOCTOR_API_URL = "http://localhost:8080/doctorverfication/all";

const indianStates = [
    "Andhra Pradesh",
    "Arunachal Pradesh",
    "Assam",
    "Bihar",
    "Chhattisgarh",
    "Goa",
    "Gujarat",
    "Haryana",
    "Himachal Pradesh",
    "Jharkhand",
    "Karnataka",
    "Kerala",
    "Madhya Pradesh",
    "Maharashtra",
    "Manipur",
    "Meghalaya",
    "Mizoram",
    "Nagaland",
    "Odisha",
    "Punjab",
    "Rajasthan",
    "Sikkim",
    "Tamil Nadu",
    "Telangana",
    "Tripura",
    "Uttar Pradesh",
    "Uttarakhand",
    "West Bengal",
    "Andaman and Nicobar Islands",
    "Chandigarh",
    "Dadra and Nagar Haveli and Daman and Diu",
    "Lakshadweep",
    "Delhi",
    "Puducherry",
];

const DoctorDetails = [
    {
        name: "A-02130936-Tharun Tharun",
        experience: "12 years",
        speciality: "Cardiologist",
        locality: "LB Nagar",
        Address: "Samraksha hospital, Chaitanyapuri, Telangana, 500060.0",
        phone: null,
        email: "drtharunm@gmail.com",
        gender: "male",
        languages: ["English", "Hindi", "Telugu"],
        rating: 4.8,
        consultationFee: 900,
        doctorPhoto: null,
        city: "Hyderabad", // Added for consistency
        state: "Telangana", // Added for consistency
    },
    {
        name: "A-02130938-Pavan Kumar Pavan Kumar",
        experience: "8 years",
        speciality: "Gastroenterologist",
        locality: "Karnataka",
        Address: "Karnataka",
        phone: null,
        email: "dr.pavankumar04@gmail.com",
        gender: "male",
        languages: ["English", "Hindi", "Kannada"],
        rating: 4.2,
        consultationFee: 750,
        doctorPhoto: null,
        city: "Bengaluru", // Added for consistency
        state: "Karnataka", // Added for consistency
    },
    {
        name: "A-02130940-Vamshi Krishna Vamshi Krishna",
        experience: "15 years",
        speciality: "Gastroenterologist",
        locality: "Himachal Pradesh",
        Address: "Himachal Pradesh",
        phone: null,
        email: null,
        gender: "male",
        languages: ["English", "Hindi", "Pahari"],
        rating: 4.9,
        consultationFee: 950,
        doctorPhoto: null,
        city: "Shimla", // Added for consistency
        state: "Himachal Pradesh", // Added for consistency
    },
    {
        name: "A-02191280-Krishna Chaitanya Doctor",
        experience: "10 years",
        speciality: "Dentist",
        locality: "Madhya Pradesh",
        Address: "Madhya Pradesh",
        phone: 8897656245,
        email: "drchaitanyak9@gmail.com",
        gender: "male",
        languages: ["English", "Hindi", "Hindi"],
        rating: 4.5,
        consultationFee: 800,
        doctorPhoto: null,
        city: "Bhopal", // Added for consistency
        state: "Madhya Pradesh", // Added for consistency
    },
];

// Constants for filter data
const SPECIALITY_KEYWORDS: { [key: string]: string[] } = {
    Cardiologist: ["cardiologist", "cardiology", "heart"],
    Dentist: ["dentist", "dental", "teeth"],
    Gynaecologist: ["gynaecologist", "gynecology", "obgyn"],
    Dermatologist: ["dermatologist", "skin"],
    Neurologist: ["neurologist", "neuro"],
    Orthopedist: ["orthopedist", "orthopedic", "bones"],
    Pediatrician: ["pediatrician", "child"],
    Pulmonologist: ["pulmonologist", "lungs", "respiratory"],
    Gastroenterologist: ["gastroenterologist", "gastro", "digestive"],
    Physiotherapist: ["physiotherapist", "physio"],
    "General Physician": ["general physician", "physician", "gp"],
    Diagnostics: ["diagnostics", "lab"],
};

const SYMPTOMS = [
    "Headache",
    "Fatigue",
    "Cough",
    "Fever",
    "Nausea or Vomiting",
    "Abdominal Pain",
    "Dizziness",
    "Shortness of Breath",
    "Chest Pain",
    "Back Pain",
    "Joint or Muscle Pain",
    "Skin Rash",
    "Sore Throat",
    "Nasal Congestion",
    "Diarrhea",
    "Constipation",
    "Urinary Issues",
    "Sleep Disturbances",
    "Mood Changes",
    "Weight Changes",
    "Appetite Changes",
    "Menstrual Irregularities",
];

const SPECIALTIES = [
    "Cardiologist",
    "Dentist",
    "Gynaecologist",
    "Dermatologist",
    "Neurologist",
    "Orthopedist",
    "Pediatrician",
    "Pulmonologist",
    "Gastroenterologist",
    "Physiotherapist",
    "General Physician",
    "Diagnostics",
];

const LOCATIONS = [
    "Delhi",
    "Mumbai",
    "Kolkata",
    "Kerala",
    "Bihar",
    "Rajasthan",
    "Hyderabad",
    "Jaipur",
    "Chennai",
    "Bengaluru",
];

const FEES = [100, 200, 300, 500, 1000, 1500, 2000, 3000, 5000];
const RATINGS = [1, 2, 3, 4, 5];
const LANGUAGES = ["English", "Hindi", "Tamil", "Telugu", "Marathi"];
const AVAILABILITY = ["Morning", "Afternoon", "Evening", "Night"];
const EXPERIENCE = ["1-3 years", "3-5 years", "5-10 years", "10+ years"];

// Symptom to specialty mapping for filtering
const SYMPTOM_TO_SPECIALTY_MAP: { [key: string]: string[] } = {
    Headache: ["Neurologist"],
    "Chest Pain": ["Cardiologist"],
    "Skin Rash": ["Dermatologist"],
    "Joint or Muscle Pain": ["Orthopedist", "Physiotherapist"],
    "Abdominal Pain": ["Gastroenterologist"],
    Cough: ["Pulmonologist"],
    "Nasal Congestion": ["Pulmonologist"],
    "Menstrual Irregularities": ["Gynaecologist"],
    "Sleep Disturbances": ["Neurologist", "General Physician"],
    "Urinary Issues": ["General Physician"],
    "Sore Throat": ["General Physician", "Pulmonologist"],
};

// Pagination settings
const DOCTORS_PER_PAGE = 10;

// Types
interface Doctor {
    id?: string;
    fullName?: string;
    medicalSpeciality?: string;
    experience?: string;
    city?: string;
    state?: string;
    country?: string;
    hospitalCurrentWorking?: string;
    medicalLicenseNumber?: string;
    doctorPhoto?: string | null;
    phone?: string | number | null;
    email?: string | null;
    consultationFee?: number;
    rating?: number;
    languages?: string[];
    availability?: string[];
    name?: string; // From DoctorDetails
    speciality?: string; // From DoctorDetails
    locality?: string; // From DoctorDetails
    Address?: string; // From DoctorDetails
    gender?: string; // From DoctorDetails
}

interface FilterState {
    searchQuery: string;
    selectedState: string;
    selectedSymptoms: string[];
    selectedSpecialties: string[];
    selectedLocations: string[];
    selectedFees: number[];
    selectedRatings: number[];
    selectedLanguages: string[];
    selectedAvailability: string[];
    selectedExperience: string[];
    currentPage: number;
}

// Helper functions
const normalize = (str: string | undefined | null): string =>
    str?.toString().trim().toLowerCase() || "";

const matchSpeciality = (
    doctorSpeciality: string | undefined,
    searchQuery: string
): boolean => {
    const normDoctor = normalize(doctorSpeciality);
    const normSearch = normalize(searchQuery);
    // Added type assertion for better type safety
    const keywords = SPECIALITY_KEYWORDS[
        normSearch as keyof typeof SPECIALITY_KEYWORDS
        ] || [normSearch];
    return keywords.some((keyword: string) => normDoctor.includes(keyword));
};

// Initial filter state
const initialFilterState: FilterState = {
    searchQuery: "",
    selectedState: "",
    selectedSymptoms: [],
    selectedSpecialties: [],
    selectedLocations: [],
    selectedFees: [],
    selectedRatings: [],
    selectedLanguages: [],
    selectedAvailability: [],
    selectedExperience: [],
    currentPage: 1,
};

// Action types
const ACTIONS = {
    SET_SEARCH_QUERY: "set_search_query",
    SET_SELECTED_STATE: "set_selected_state",
    TOGGLE_FILTER_ITEM: "toggle_filter_item",
    REMOVE_FILTER_ITEM: "remove_filter_item",
    CLEAR_ALL_FILTERS: "clear_all_filters",
    SET_CURRENT_PAGE: "set_current_page",
    LOAD_URL_PARAMS: "load_url_params",
};

// Filter reducer
function filterReducer(state: FilterState, action: any): FilterState {
    switch (action.type) {
        case ACTIONS.SET_SEARCH_QUERY:
            return { ...state, searchQuery: action.payload, currentPage: 1 };

        case ACTIONS.SET_SELECTED_STATE:
            return { ...state, selectedState: action.payload, currentPage: 1 };

        case ACTIONS.TOGGLE_FILTER_ITEM: {
            const { category, value } = action.payload;
            const currentValues = state[category as keyof FilterState] as any[];
            const newValues = currentValues.includes(value)
                ? currentValues.filter((item) => item !== value)
                : [...currentValues, value];

            return { ...state, [category]: newValues, currentPage: 1 };
        }

        case ACTIONS.REMOVE_FILTER_ITEM: {
            const { category, value } = action.payload;
            return {
                ...state,
                [category]: (state[category as keyof FilterState] as any[]).filter(
                    (item) => item !== value
                ),
                currentPage: 1,
            };
        }

        case ACTIONS.CLEAR_ALL_FILTERS:
            return {
                ...initialFilterState,
                searchQuery: state.searchQuery,
                selectedState: state.selectedState,
            };

        case ACTIONS.SET_CURRENT_PAGE:
            return { ...state, currentPage: action.payload };

        case ACTIONS.LOAD_URL_PARAMS:
            return { ...state, ...action.payload, currentPage: 1 };

        default:
            return state;
    }
}

// Component for a filter section
interface FilterSectionProps {
    title: string;
    items: any[];
    selectedItems: any[];
    onToggle: (item: any) => void;
    showDropdown: boolean;
    onToggleDropdown: (title: string) => void;
    renderItem?: (item: any) => React.ReactNode;
}

const FilterSection: React.FC<FilterSectionProps> = ({
                                                         title,
                                                         items,
                                                         selectedItems,
                                                         onToggle,
                                                         showDropdown,
                                                         onToggleDropdown,
                                                         renderItem,
                                                     }) => {
    return (
        <View style={styles.filterSection}>
            <TouchableOpacity
                style={styles.filterSectionHeader} // Corrected style syntax
                onPress={() => onToggleDropdown(title)}
            >
                <Text style={styles.filterSectionTitle}>{title}</Text>{" "}
                {/* Corrected style syntax */}
                <Ionicons
                    name={showDropdown ? "chevron-up" : "chevron-down"}
                    size={20}
                    color="#666"
                />
            </TouchableOpacity>

            {showDropdown && (
                <View style={styles.filterDropdownContent}>
                    {" "}
                    {/* Corrected style syntax */}
                    {items.map((item, index) => (
                        <TouchableOpacity
                            key={`${title}-${index}`}
                            style={styles.filterCheckboxContainer} // Corrected style syntax
                            onPress={() => onToggle(item)}
                        >
                            <View style={styles.checkbox}>
                                {selectedItems.includes(item) && (
                                    <Ionicons name="checkmark" size={16} color="#007AFF" />
                                )}
                            </View>
                            <Text style={styles.filterCheckboxLabel}>
                                {" "}
                                {/* Corrected style syntax */}
                                {renderItem ? renderItem(item) : item}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            )}
        </View>
    );
};

// Star rating component
interface StarRatingProps {
    rating: number;
}

const StarRating: React.FC<StarRatingProps> = ({ rating }) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    return (
        <View style={styles.starRating}>
            {[...Array(fullStars)].map((_, i) => (
                <Ionicons key={`star-${i}`} name="star" size={16} color="#FFD700" />
            ))}
            {hasHalfStar && <Ionicons name="star-half" size={16} color="#FFD700" />}
            {[...Array(5 - fullStars - (hasHalfStar ? 1 : 0))].map((_, i) => (
                <Ionicons
                    key={`star-empty-${i}`}
                    name="star-outline"
                    size={16}
                    color="#FFD700"
                />
            ))}
        </View>
    );
};

// Doctor card component
interface DoctorCardProps {
    doctor: Doctor;
    onClick: (doctor: Doctor) => void;
}

const DoctorCard: React.FC<DoctorCardProps> = ({ doctor, onClick }) => {
    const getDoctorImage = (doctorPhoto: string | null | undefined) => {
        if (!doctorPhoto) return defaultUser;
        return doctorPhoto.startsWith("http")
            ? { uri: doctorPhoto }
            : { uri: `data:image/jpeg;base64,${doctorPhoto}` };
    };

    return (
        <TouchableOpacity style={styles.doctorCard} onPress={() => onClick(doctor)}>
            <View style={styles.doctorCardLeft}>
                <View style={styles.doctorImageContainer}>
                    <Image
                        source={getDoctorImage(doctor.doctorPhoto)}
                        style={styles.doctorImage}
                        resizeMode="cover"
                    />
                </View>
                <TouchableOpacity style={styles.bookAppointmentBtn}>
                    <Text style={styles.bookAppointmentText}>Book Appointment</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.doctorInfo}>
                <Text style={styles.doctorName}>
                    Dr.{" "}
                    {(doctor.fullName || doctor.name || "Not Mentioned").toUpperCase()}
                </Text>

                <View style={styles.doctorSpecialty}>
                    <Text style={styles.doctorSpecialtyLabel}>Specialty: </Text>
                    <Text style={styles.doctorSpecialtyValue}>
                        {doctor.medicalSpeciality || doctor.speciality || "Not Mentioned"}
                    </Text>
                </View>

                <View style={styles.doctorMetaInfo}>
                    <View style={styles.doctorMetaItem}>
                        <MaterialIcons name="work-outline" size={16} color="#666" />
                        <Text style={styles.metaText}>
                            {doctor.experience}{" "}
                            {parseInt(doctor.experience || "0", 10) > 1 ? "years" : "year"}{" "}
                            {/* Added radix */}
                        </Text>
                    </View>

                    <View style={styles.doctorMetaItem}>
                        <Ionicons name="location-outline" size={16} color="#666" />
                        <Text style={styles.metaText}>
                            {doctor.city || doctor.locality || "Not Mentioned"},{" "}
                            {doctor.state || "Not Mentioned"}
                        </Text>
                    </View>

                    <View style={styles.doctorMetaItem}>
                        <Ionicons name="language-outline" size={16} color="#666" />
                        <Text style={styles.metaText}>
                            {(doctor.languages || ["English"]).join(", ")}
                        </Text>
                    </View>
                </View>

                <View style={styles.doctorBottomInfo}>
                    <View style={styles.feeInfo}>
                        <Text style={styles.feeText}>
                            ₹{doctor.consultationFee || "N/A"}
                        </Text>
                    </View>

                    <View style={styles.ratingInfo}>
                        <StarRating rating={doctor.rating || 0} />
                        <Text style={styles.ratingValue}>({doctor.rating || "N/A"})</Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
};

// State selector modal component
interface StateSelectorModalProps {
    visible: boolean;
    onClose: () => void;
    selectedState: string;
    onSelectState: (state: string) => void;
}

const StateSelectorModal: React.FC<StateSelectorModalProps> = ({
                                                                   visible,
                                                                   onClose,
                                                                   selectedState,
                                                                   onSelectState,
                                                               }) => {
    return (
        <Modal visible={visible} animationType="slide" transparent>
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>Select State</Text>
                        <TouchableOpacity onPress={onClose}>
                            <Ionicons name="close" size={24} color="#000" />
                        </TouchableOpacity>
                    </View>
                    <FlatList
                        data={["All States", ...indianStates]}
                        keyExtractor={(item) => item}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={[
                                    styles.stateOption,
                                    (item === "All States" ? "" : item) === selectedState &&
                                    styles.selectedStateOption,
                                ]}
                                onPress={() => {
                                    onSelectState(item === "All States" ? "" : item);
                                    onClose();
                                }}
                            >
                                <Text
                                    style={[
                                        styles.stateOptionText,
                                        (item === "All States" ? "" : item) === selectedState &&
                                        styles.selectedStateOptionText,
                                    ]}
                                >
                                    {item}
                                </Text>
                            </TouchableOpacity>
                        )}
                    />
                </View>
            </View>
        </Modal>
    );
};

// Main component
const FindDoctorScreen: React.FC = () => {
    // Renamed from FindDoctorPage to FindDoctorScreen
    const navigation = useNavigation();
    const route = useRoute();

    // Extract route params
    const specialityFromParams = (route.params as any)?.speciality || "";

    // Use reducer for filter state management
    const [filterState, dispatch] = useReducer(filterReducer, {
        ...initialFilterState,
        searchQuery: specialityFromParams,
    });

    // Destructure state for easier access
    const {
        searchQuery,
        selectedState,
        selectedSymptoms,
        selectedSpecialties,
        selectedLocations,
        selectedFees,
        selectedRatings,
        selectedLanguages,
        selectedAvailability,
        selectedExperience,
        currentPage,
    } = filterState;

    // Component state
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showStateModal, setShowStateModal] = useState(false);
    // const [showFiltersModal, setShowFiltersModal] = useState(false); // Removed as it was unused
    const [showMobileFilters, setShowMobileFilters] = useState(false); // Added for potential mobile filter modal

    // Dropdown visibility states
    const [dropdownStates, setDropdownStates] = useState({
        Symptoms: false,
        Specialty: false,
        Location: false,
        "Consultation Fee": false,
        Rating: false,
        Language: false,
        Availability: false,
        Experience: false,
    });

    // Fetch doctors on component mount
    useEffect(() => {
        const fetchDoctors = async () => {
            setLoading(true);
            try {
                const response = await fetch(GET_DOCTOR_API_URL);
                if (!response.ok) {
                    throw new Error(`API error: ${response.status}`);
                }
                const data = await response.json();
                setDoctors(data);
            } catch (error: any) {
                // Type 'any' for error for flexibility
                console.error("Error fetching doctors:", error);
                setError("Failed to load doctors. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchDoctors();
    }, []);

    // Update search query from route params
    useEffect(() => {
        if (specialityFromParams) {
            dispatch({
                type: ACTIONS.LOAD_URL_PARAMS,
                payload: { searchQuery: specialityFromParams },
            });
        }
    }, [specialityFromParams]);

    // Toggle dropdown visibility
    const toggleFilterDropdown = useCallback((section: string) => {
        setDropdownStates((prev) => ({
            ...prev,
            [section]: !prev[section as keyof typeof prev],
        }));
    }, []);

    // Handle filter changes
    const handleToggleFilter = useCallback((category: string, value: any) => {
        dispatch({
            type: ACTIONS.TOGGLE_FILTER_ITEM,
            payload: { category, value },
        });
    }, []);

    // Remove selected filter
    const removeFilter = useCallback((category: string, value: any) => {
        dispatch({
            type: ACTIONS.REMOVE_FILTER_ITEM,
            payload: { category, value },
        });
    }, []);

    // Clear all filters
    const clearAllFilters = useCallback(() => {
        dispatch({ type: ACTIONS.CLEAR_ALL_FILTERS });
    }, []);

    // Filter doctors based on criteria
    const filteredDoctors = useMemo(() => {
        const normalizedSearch = normalize(searchQuery);

        // Helper functions to check if a doctor matches each filter
        const matchesSymptomFilter = (doctor: Doctor) => {
            if (selectedSymptoms.length === 0) return true;

            return selectedSymptoms.some((symptom) => {
                const specialtiesForSymptom = SYMPTOM_TO_SPECIALTY_MAP[symptom] || [];
                return specialtiesForSymptom.includes(
                    doctor.medicalSpeciality || doctor.speciality || ""
                );
            });
        };

        const matchesSpecialtyFilter = (doctor: Doctor) => {
            if (selectedSpecialties.length === 0) return true;
            return selectedSpecialties.some((specialty) =>
                normalize(doctor.medicalSpeciality || doctor.speciality).includes(
                    normalize(specialty)
                )
            );
        };

        const matchesLocationFilter = (doctor: Doctor) => {
            if (selectedLocations.length === 0) return true;
            return selectedLocations.some(
                (location) =>
                    normalize(doctor.city || doctor.locality).includes(
                        normalize(location)
                    ) || normalize(doctor.state).includes(normalize(location))
            );
        };

        const matchesFeeFilter = (doctor: Doctor) => {
            if (selectedFees.length === 0) return true;
            // Use provided consultationFee or a fixed default for mock data
            const doctorFee =
                doctor.consultationFee !== undefined && doctor.consultationFee !== null
                    ? doctor.consultationFee
                    : 800; // Example fixed default for mock data
            return selectedFees.some((fee) => doctorFee <= fee);
        };

        const matchesRatingFilter = (doctor: Doctor) => {
            if (selectedRatings.length === 0) return true;
            // Use provided rating or a fixed default for mock data
            const doctorRating =
                doctor.rating !== undefined && doctor.rating !== null
                    ? doctor.rating
                    : 4; // Example fixed default for mock data
            return selectedRatings.includes(doctorRating);
        };

        const matchesLanguageFilter = (doctor: Doctor) => {
            if (selectedLanguages.length === 0) return true;
            const doctorLanguages = doctor.languages || ["English"];
            return selectedLanguages.some((language) =>
                doctorLanguages.includes(language)
            );
        };

        const matchesAvailabilityFilter = (doctor: Doctor) => {
            if (selectedAvailability.length === 0) return true;
            const doctorAvailability = doctor.availability || ["Morning", "Evening"];
            return selectedAvailability.some((time) =>
                doctorAvailability.includes(time)
            );
        };

        const matchesExperienceFilter = (doctor: Doctor) => {
            if (selectedExperience.length === 0) return true;

            const getExperienceCategory = (years: number) => {
                if (years <= 3) return "1-3 years";
                if (years <= 5) return "3-5 years";
                if (years <= 10) return "5-10 years";
                return "10+ years";
            };

            const doctorExperienceYears = parseInt(doctor.experience || "0", 10); // Added radix
            const doctorExperienceCategory = getExperienceCategory(
                doctorExperienceYears
            );

            return selectedExperience.includes(doctorExperienceCategory);
        };

        // Combine API doctors with static data
        let combinedDoctors: Doctor[] = [
            ...doctors.filter(
                (doctor) =>
                    (normalizedSearch === "" ||
                        matchSpeciality(doctor.medicalSpeciality, normalizedSearch)) &&
                    (selectedState === "" ||
                        normalize(doctor.state) === normalize(selectedState))
            ),
            ...DoctorDetails.filter(
                (doc) =>
                    (normalizedSearch === "" ||
                        matchSpeciality(doc.speciality, normalizedSearch)) &&
                    (selectedState === "" ||
                        // Using city and state for consistency with API response
                        normalize(doc.city).includes(normalize(selectedState)) ||
                        normalize(doc.state).includes(normalize(selectedState)))
            ).map((doc, index) => ({
                id: `mock-${index}-${doc.name}`, // Unique ID for mock doctors
                fullName: doc.name || "Not Mentioned",
                medicalSpeciality: doc.speciality || "Not Mentioned",
                experience: doc.experience || "5 years", // Use actual experience from mock data
                city: doc.locality || doc.city || "Not Mentioned", // Use locality or city from mock data
                state: doc.state || "Not Mentioned", // Use state from mock data
                country: "India",
                hospitalCurrentWorking: doc.Address || "Not Mentioned",
                medicalLicenseNumber: "N/A",
                doctorPhoto: doc.doctorPhoto || null,
                phone: doc.phone !== null ? doc.phone : "Not Mentioned", // Handle null phone
                email: doc.email || "Not Mentioned",
                consultationFee: doc.consultationFee, // Use actual consultation fee from mock data
                rating: doc.rating, // Use actual rating from mock data
                languages: doc.languages || ["English"], // Use actual languages from mock data
                availability: ["Morning", "Afternoon", "Evening"], // Consistent availability for mock data
            })),
        ];

        // Apply all filters
        return combinedDoctors.filter(
            (doctor) =>
                matchesSymptomFilter(doctor) &&
                matchesSpecialtyFilter(doctor) &&
                matchesLocationFilter(doctor) &&
                matchesFeeFilter(doctor) &&
                matchesRatingFilter(doctor) &&
                matchesLanguageFilter(doctor) &&
                matchesAvailabilityFilter(doctor) &&
                matchesExperienceFilter(doctor)
        );
    }, [
        doctors,
        searchQuery,
        selectedState,
        selectedSymptoms,
        selectedSpecialties,
        selectedLocations,
        selectedFees,
        selectedRatings,
        selectedLanguages,
        selectedAvailability,
        selectedExperience,
    ]);

    // Calculate pagination
    const totalPages = Math.ceil(filteredDoctors.length / DOCTORS_PER_PAGE);
    const paginatedDoctors = filteredDoctors.slice(
        (currentPage - 1) * DOCTORS_PER_PAGE,
        currentPage * DOCTORS_PER_PAGE
    );

    // Handle page change
    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            dispatch({ type: ACTIONS.SET_CURRENT_PAGE, payload: newPage });
            // Scroll to top of the list when page changes
            // You might need a ref for the ScrollView/FlatList here
        }
    };

    // Navigate to doctor profile
    // const navigateToDoctorProfile = (doctor: Doctor) => {
    //     // Ensure 'DoctorProfile' route exists in your navigator
    //     navigation.navigate('DoctorProfile' as never, { doctor } as never);
    // };

    // Check if any filters are applied
    const hasActiveFilters =
        searchQuery !== "" ||
        selectedState !== "" ||
        selectedSymptoms.length > 0 ||
        selectedSpecialties.length > 0 ||
        selectedLocations.length > 0 ||
        selectedFees.length > 0 ||
        selectedRatings.length > 0 ||
        selectedLanguages.length > 0 ||
        selectedAvailability.length > 0 ||
        selectedExperience.length > 0;

    // Helper render function for active filter tags
    const renderFilterTag = (
        value: string | number,
        filterType: string,
        prefix?: string,
        suffix?: string
    ) => (
        <View key={`${filterType}-${value}`} style={styles.filterTag}>
            {" "}
            {/* Corrected style syntax */}
            <Text style={styles.filterTagText}>
                {" "}
                {/* Corrected style syntax */}
                {prefix}
                {value}
                {suffix}
            </Text>
            <TouchableOpacity
                style={styles.filterTagRemove} // Corrected style syntax
                onPress={() => removeFilter(filterType, value)}
            >
                <Text style={styles.filterTagRemoveText}>×</Text>{" "}
                {/* Corrected style syntax */}
            </TouchableOpacity>
        </View>
    );

    const renderPaginationButton = (pageNumber: number) => {
        // Only show a window of pages around current page, plus first and last
        const isCurrent = pageNumber === currentPage;
        const showEllipsisBefore = pageNumber === currentPage - 3 && pageNumber > 1;
        const showEllipsisAfter =
            pageNumber === currentPage + 3 && pageNumber < totalPages;

        if (showEllipsisBefore)
            return (
                <Text key="ellipsis-before" style={styles.ellipsis}>
                    ...
                </Text>
            );
        if (showEllipsisAfter)
            return (
                <Text key="ellipsis-after" style={styles.ellipsis}>
                    ...
                </Text>
            );

        if (
            pageNumber === 1 ||
            pageNumber === totalPages ||
            (pageNumber >= currentPage - 2 && pageNumber <= currentPage + 2)
        ) {
            return (
                <TouchableOpacity
                    key={pageNumber}
                    style={[styles.pageNumber, isCurrent && styles.pageNumberActive]} // Corrected style syntax
                    onPress={() => handlePageChange(pageNumber)}
                >
                    <Text
                        style={[
                            styles.pageNumberText,
                            isCurrent && styles.pageNumberTextActive,
                        ]}
                    >
                        {pageNumber}
                    </Text>{" "}
                    {/* Corrected style syntax */}
                </TouchableOpacity>
            );
        }
        return null;
    };

    if (loading) {
        return (
            <SafeAreaView style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#007AFF" />
                <Text>Loading doctors...</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            {/* Error Banner */}
            {error && (
                <View style={[styles.errorContainer, { padding: 10, flex: 0 }]}>
                    <Text style={styles.errorText}>{error}</Text>
                    <TouchableOpacity
                        style={styles.retryButton}
                        onPress={() => {
                            // Optionally, you can implement retry logic here
                        }}
                    >
                        <Text style={styles.retryButtonText}>Try Again</Text>
                    </TouchableOpacity>
                </View>
            )}
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={styles.backButton}
                >
                    <Ionicons name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search doctors by specialty..."
                    value={searchQuery}
                    onChangeText={(text) =>
                        dispatch({ type: ACTIONS.SET_SEARCH_QUERY, payload: text })
                    }
                />
                <TouchableOpacity
                    onPress={() => setShowStateModal(true)}
                    style={styles.stateSelector}
                >
                    <Text style={styles.stateSelectorText}>
                        {selectedState || "Select State"}
                    </Text>
                    <Ionicons name="chevron-down" size={18} color="#333" />
                </TouchableOpacity>
            </View>

            {/* Active Filters Display */}
            {hasActiveFilters && (
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.activeFiltersContainer}
                >
                    {searchQuery !== "" && renderFilterTag(searchQuery, "searchQuery")}
                    {selectedState !== "" &&
                        renderFilterTag(selectedState, "selectedState")}
                    {selectedSymptoms.map((s) => renderFilterTag(s, "selectedSymptoms"))}
                    {selectedSpecialties.map((s) =>
                        renderFilterTag(s, "selectedSpecialties")
                    )}
                    {selectedLocations.map((l) =>
                        renderFilterTag(l, "selectedLocations")
                    )}
                    {selectedFees.map((f) => renderFilterTag(f, "selectedFees", "₹", ""))}
                    {selectedRatings.map((r) =>
                        renderFilterTag(r, "selectedRatings", "", " Stars")
                    )}
                    {selectedLanguages.map((l) =>
                        renderFilterTag(l, "selectedLanguages")
                    )}
                    {selectedAvailability.map((a) =>
                        renderFilterTag(a, "selectedAvailability")
                    )}
                    {selectedExperience.map((e) =>
                        renderFilterTag(e, "selectedExperience")
                    )}
                    <TouchableOpacity
                        onPress={clearAllFilters}
                        style={styles.clearFiltersBtn}
                    >
                        <Text style={styles.clearFiltersText}>Clear All</Text>
                    </TouchableOpacity>
                </ScrollView>
            )}

            <View style={styles.contentContainer}>
                {/* Filters Section (Desktop/Larger screens) */}
                <ScrollView style={styles.filtersSidebar}>
                    <FilterSection
                        title="Symptoms"
                        items={SYMPTOMS}
                        selectedItems={selectedSymptoms}
                        onToggle={(item) => handleToggleFilter("selectedSymptoms", item)}
                        showDropdown={dropdownStates.Symptoms}
                        onToggleDropdown={toggleFilterDropdown}
                    />
                    <FilterSection
                        title="Specialty"
                        items={SPECIALTIES}
                        selectedItems={selectedSpecialties}
                        onToggle={(item) => handleToggleFilter("selectedSpecialties", item)}
                        showDropdown={dropdownStates.Specialty}
                        onToggleDropdown={toggleFilterDropdown}
                    />
                    <FilterSection
                        title="Location"
                        items={LOCATIONS}
                        selectedItems={selectedLocations}
                        onToggle={(item) => handleToggleFilter("selectedLocations", item)}
                        showDropdown={dropdownStates.Location}
                        onToggleDropdown={toggleFilterDropdown}
                    />
                    <FilterSection
                        title="Consultation Fee"
                        items={FEES}
                        selectedItems={selectedFees}
                        onToggle={(item) => handleToggleFilter("selectedFees", item)}
                        showDropdown={dropdownStates["Consultation Fee"]}
                        onToggleDropdown={toggleFilterDropdown}
                        renderItem={(item) => <Text>₹{item}</Text>}
                    />
                    <FilterSection
                        title="Rating"
                        items={RATINGS}
                        selectedItems={selectedRatings}
                        onToggle={(item) => handleToggleFilter("selectedRatings", item)}
                        showDropdown={dropdownStates.Rating}
                        onToggleDropdown={toggleFilterDropdown}
                        renderItem={(item) => <StarRating rating={item} />}
                    />
                    <FilterSection
                        title="Language"
                        items={LANGUAGES}
                        selectedItems={selectedLanguages}
                        onToggle={(item) => handleToggleFilter("selectedLanguages", item)}
                        showDropdown={dropdownStates.Language}
                        onToggleDropdown={toggleFilterDropdown}
                    />
                    <FilterSection
                        title="Availability"
                        items={AVAILABILITY}
                        selectedItems={selectedAvailability}
                        onToggle={(item) =>
                            handleToggleFilter("selectedAvailability", item)
                        }
                        showDropdown={dropdownStates.Availability}
                        onToggleDropdown={toggleFilterDropdown}
                    />
                    <FilterSection
                        title="Experience"
                        items={EXPERIENCE}
                        selectedItems={selectedExperience}
                        onToggle={(item) => handleToggleFilter("selectedExperience", item)}
                        showDropdown={dropdownStates.Experience}
                        onToggleDropdown={toggleFilterDropdown}
                    />
                </ScrollView>

                {/* Doctor List Section */}
                <View style={styles.doctorListSection}>
                    {paginatedDoctors.length > 0 ? (
                        <FlatList
                            data={paginatedDoctors}
                            keyExtractor={(item) =>
                                item.id || item.name || Math.random().toString()
                            } // Fallback for key
                            renderItem={({ item }) => (
                                <DoctorCard
                                    doctor={item}
                                    // onClick={navigateToDoctorProfile}
                                    onClick={alert} // Placeholder for navigation
                                />
                            )}
                            contentContainerStyle={styles.doctorListContent}
                        />
                    ) : (
                        <View style={styles.noResultsContainer}>
                            <Text style={styles.noResultsText}>
                                No doctors found matching your criteria.
                            </Text>
                            <TouchableOpacity
                                style={styles.clearFiltersBtnLarge}
                                onPress={clearAllFilters}
                            >
                                <Text style={styles.clearFiltersBtnLargeText}>
                                    Clear All Filters
                                </Text>
                            </TouchableOpacity>
                        </View>
                    )}

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <View style={styles.paginationContainer}>
                            <TouchableOpacity
                                onPress={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                style={styles.pageButton} // Corrected style syntax
                            >
                                <Ionicons
                                    name="arrow-back"
                                    size={20}
                                    color={currentPage === 1 ? "#ccc" : "#333"}
                                />
                            </TouchableOpacity>
                            {[...Array(totalPages)].map((_, i) =>
                                renderPaginationButton(i + 1)
                            )}
                            <TouchableOpacity
                                onPress={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                style={styles.pageButton} // Corrected style syntax
                            >
                                <Ionicons
                                    name="arrow-forward"
                                    size={20}
                                    color={currentPage === totalPages ? "#ccc" : "#333"}
                                />
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            </View>

            {/* State Selector Modal */}
            <StateSelectorModal
                visible={showStateModal}
                onClose={() => setShowStateModal(false)}
                selectedState={selectedState}
                onSelectState={(state) =>
                    dispatch({ type: ACTIONS.SET_SELECTED_STATE, payload: state })
                }
            />

            {/* Mobile Filter Modal (if implemented) */}
            {/* You would typically use a separate modal for mobile filters or integrate a responsive design */}
        </SafeAreaView>
    );
};

// Stylesheet
const colors = {
    primary: "#007AFF", // Blue
    secondary: "#555",
    textPrimary: "#333",
    textSecondary: "#666",
    background: "#F0F2F5", // Light grey background
    cardBackground: "#FFFFFF",
    border: "#E0E0E0",
    star: "#FFD700", // Gold
    success: "#28A745",
    danger: "#DC3545",
};

const spacing = {
    xs: 5,
    sm: 10,
    md: 15,
    lg: 20,
    xl: 25,
    xxl: 30,
};

const radius = {
    sm: 5,
    md: 10,
    lg: 15,
    xl: 20,
    circle: 999, // For perfectly round elements
};

const fontSizes = {
    sm: 12,
    md: 16,
    lg: 20,
    xl: 24,
    xxl: 28,
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        padding: spacing.md,
        backgroundColor: colors.cardBackground,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
        paddingTop: spacing.lg,
    },
    backButton: {
        marginRight: spacing.sm,
        padding: spacing.xs,
    },
    searchInput: {
        flex: 1,
        height: 40,
        backgroundColor: "#f2f2f2",
        borderRadius: radius.md,
        paddingHorizontal: spacing.md,
        marginRight: spacing.sm,
        fontSize: fontSizes.md,
        color: colors.textPrimary,
    },
    stateSelector: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.md,
        backgroundColor: "#e9e9e9",
        borderRadius: radius.md,
    },
    stateSelectorText: {
        fontSize: fontSizes.md,
        marginRight: spacing.xs,
        color: colors.textPrimary,
    },
    contentContainer: {
        flex: 1,
        flexDirection: "row",
        padding: spacing.md,
    },
    filtersSidebar: {
        width: 250, // Fixed width for sidebar
        backgroundColor: colors.cardBackground,
        borderRadius: radius.md,
        padding: spacing.md,
        marginRight: spacing.md,
        // Shadow for iOS and Android
        ...Platform.select({
            ios: {
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
            },
            android: {
                elevation: 5,
            },
        }),
    },
    filterSection: {
        marginBottom: spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
        paddingBottom: spacing.sm,
    },
    filterSectionHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: spacing.sm,
    },
    filterSectionTitle: {
        fontSize: fontSizes.lg,
        fontWeight: "600",
        color: colors.textPrimary,
    },
    filterDropdownContent: {
        paddingVertical: spacing.sm,
    },
    filterCheckboxContainer: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: spacing.xs,
    },
    checkbox: {
        width: 20,
        height: 20,
        borderRadius: radius.sm,
        borderWidth: 1,
        borderColor: colors.border,
        justifyContent: "center",
        alignItems: "center",
        marginRight: spacing.sm,
        backgroundColor: colors.background,
    },
    filterCheckboxLabel: {
        fontSize: fontSizes.md,
        color: colors.textSecondary,
    },
    doctorListSection: {
        flex: 1,
    },
    doctorListContent: {
        paddingBottom: spacing.md,
    },
    doctorCard: {
        flexDirection: "row",
        backgroundColor: colors.cardBackground,
        borderRadius: radius.md,
        marginBottom: spacing.md,
        padding: spacing.md,
        // Shadow for iOS and Android
        ...Platform.select({
            ios: {
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
            },
            android: {
                elevation: 5,
            },
        }),
    },
    doctorCardLeft: {
        marginRight: spacing.md,
        alignItems: "center",
    },
    doctorImageContainer: {
        width: 100,
        height: 100,
        borderRadius: radius.circle,
        overflow: "hidden",
        borderWidth: 2,
        borderColor: colors.primary,
        marginBottom: spacing.sm,
    },
    doctorImage: {
        width: "100%",
        height: "100%",
    },
    bookAppointmentBtn: {
        backgroundColor: colors.primary,
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.md,
        borderRadius: radius.md,
    },
    bookAppointmentText: {
        color: colors.cardBackground,
        fontWeight: "bold",
        fontSize: fontSizes.sm,
    },
    doctorInfo: {
        flex: 1,
    },
    doctorName: {
        fontSize: fontSizes.lg,
        fontWeight: "bold",
        color: colors.textPrimary,
        marginBottom: spacing.xs,
    },
    doctorSpecialty: {
        flexDirection: "row",
        marginBottom: spacing.xs,
    },
    doctorSpecialtyLabel: {
        fontSize: fontSizes.md,
        color: colors.textSecondary,
    },
    doctorSpecialtyValue: {
        fontSize: fontSizes.md,
        color: colors.textPrimary,
        fontWeight: "500",
    },
    doctorMetaInfo: {
        marginBottom: spacing.sm,
    },
    doctorMetaItem: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: spacing.xs,
    },
    metaText: {
        marginLeft: spacing.xs,
        fontSize: fontSizes.sm,
        color: colors.textSecondary,
    },
    doctorBottomInfo: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: spacing.sm,
        borderTopWidth: 1,
        borderTopColor: colors.border,
        paddingTop: spacing.sm,
    },
    feeInfo: {
        backgroundColor: colors.background,
        paddingVertical: spacing.xs,
        paddingHorizontal: spacing.sm,
        borderRadius: radius.sm,
    },
    feeText: {
        fontSize: fontSizes.md,
        fontWeight: "bold",
        color: colors.primary,
    },
    ratingInfo: {
        flexDirection: "row",
        alignItems: "center",
    },
    starRating: {
        flexDirection: "row",
        marginRight: spacing.xs,
    },
    ratingValue: {
        fontSize: fontSizes.sm,
        color: colors.textSecondary,
    },
    paginationContainer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginTop: spacing.md,
        paddingBottom: spacing.md,
    },
    pageButton: {
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.md,
        marginHorizontal: spacing.xs,
        borderRadius: radius.sm,
        backgroundColor: colors.cardBackground,
        borderWidth: 1,
        borderColor: colors.border,
    },
    pageNumber: {
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.md,
        marginHorizontal: spacing.xs,
        borderRadius: radius.sm,
        backgroundColor: colors.cardBackground,
        borderWidth: 1,
        borderColor: colors.border,
    },
    pageNumberActive: {
        backgroundColor: colors.primary,
        borderColor: colors.primary,
    },
    pageNumberText: {
        fontSize: fontSizes.md,
        color: colors.textPrimary,
    },
    pageNumberTextActive: {
        color: colors.cardBackground,
        fontWeight: "bold",
    },
    ellipsis: {
        fontSize: fontSizes.md,
        marginHorizontal: spacing.xs,
        color: colors.textSecondary,
    },
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContent: {
        backgroundColor: colors.cardBackground,
        borderRadius: radius.md,
        padding: spacing.md,
        width: "80%",
        maxHeight: "70%",
    },
    modalHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: spacing.md,
        paddingBottom: spacing.sm,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    modalTitle: {
        fontSize: fontSizes.xl,
        fontWeight: "bold",
        color: colors.textPrimary,
    },
    stateOption: {
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    selectedStateOption: {
        backgroundColor: colors.primary,
    },
    stateOptionText: {
        fontSize: fontSizes.md,
        color: colors.textPrimary,
    },
    selectedStateOptionText: {
        color: colors.cardBackground,
        fontWeight: "bold",
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: colors.background,
    },
    errorContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: colors.background,
        padding: spacing.lg,
    },
    errorText: {
        fontSize: fontSizes.lg,
        color: colors.danger,
        textAlign: "center",
        marginBottom: spacing.md,
    },
    retryButton: {
        backgroundColor: colors.primary,
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.xl,
        borderRadius: radius.md,
    },
    retryButtonText: {
        color: colors.cardBackground,
        fontSize: fontSizes.lg,
        fontWeight: "bold",
    },
    activeFiltersContainer: {
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        backgroundColor: colors.cardBackground,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    filterTag: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: colors.primary,
        borderRadius: radius.md,
        paddingVertical: spacing.xs,
        paddingHorizontal: spacing.sm,
        marginRight: spacing.sm,
        marginBottom: spacing.xs,
    },
    filterTagText: {
        color: colors.cardBackground,
        fontSize: fontSizes.sm,
        marginRight: spacing.xs,
    },
    filterTagRemove: {
        marginLeft: spacing.xs,
    },
    filterTagRemoveText: {
        color: colors.cardBackground,
        fontWeight: "bold",
        fontSize: fontSizes.md,
    },
    clearFiltersBtn: {
        backgroundColor: colors.secondary,
        borderRadius: radius.md,
        paddingVertical: spacing.xs,
        paddingHorizontal: spacing.sm,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: spacing.xs,
    },
    clearFiltersText: {
        color: colors.cardBackground,
        fontSize: fontSizes.sm,
    },
    noResultsContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: spacing.lg,
    },
    noResultsText: {
        fontSize: fontSizes.lg,
        color: colors.textSecondary,
        textAlign: "center",
        marginBottom: spacing.lg,
    },
    clearFiltersBtnLarge: {
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.lg,
        backgroundColor: colors.primary,
        borderRadius: radius.md,
        // No direct hover styles in React Native.
    },
    clearFiltersBtnLargeText: {
        color: "white",
        fontWeight: "500",
        fontSize: fontSizes.md,
    },
});

export default FindDoctorScreen;

// import { Feather, FontAwesome5 } from "@expo/vector-icons"; // Commented out, not available in this self-contained file
import CheckBox from "@react-native-community/checkbox";
import React, { useEffect, useState } from "react";
import {
    Alert,
    Dimensions,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    useColorScheme,
    View,
} from "react-native";

// Get screen dimensions
const { width, height } = Dimensions.get("window");
const isSmallDevice = width < 576;
const isMediumDevice = width < 768;
const isLargeDevice = width < 992;

// Helper function to create platform-specific shadows
const createShadow = (elevation: number, color: string, opacity: number) => {
    return Platform.select({
        ios: {
            shadowColor: color,
            shadowOffset: { width: 0, height: elevation / 2 },
            shadowOpacity: opacity,
            shadowRadius: elevation,
        },
        android: {
            elevation: elevation,
        },
        default: {},
    });
};

// Theme definitions
const lightTheme = {
    primaryColor: "#3a7bd5",
    primaryLight: "#5794f7",
    primaryDark: "#2a5da8",
    accentColor: "#00d0b0",
    accentHover: "#00b89b",
    errorColor: "#ff4757",
    successColor: "#2ed573",
    textDark: "#333",
    textLight: "#777",
    textWhite: "#fff",
    bgLight: "#f9fbfd",
    bgWhite: "#fff",
    shadowColorMain: "#000",
    shadowOpacitySm: 0.1,
    shadowOpacityMd: 0.07,
    shadowOpacityLg: 0.1,
};

const darkTheme = {
    primaryColor: "#4a8bff",
    primaryLight: "#6ca3ff",
    primaryDark: "#3a7bd5",
    accentColor: "#00e0c0",
    accentHover: "#00d0b0",
    errorColor: "#ff5a67",
    successColor: "#41e083",
    textDark: "#e0e0e0",
    textLight: "#a0a0a0",
    textWhite: "#fff",
    bgLight: "#1a1a2e",
    bgWhite: "#222438",
    shadowColorMain: "#000",
    shadowOpacitySm: 0.2,
    shadowOpacityMd: 0.15,
    shadowOpacityLg: 0.2,
};

// Types
type User = {
    email: string;
    role: string;
};

type Theme = typeof lightTheme;

// Create styles function
const createStyles = (theme: Theme) =>
    StyleSheet.create({
        // Page Layout
        authPage: {
            flex: 1,
            backgroundColor: theme.bgLight,
            padding: isSmallDevice ? 16 : 32,
        },
        authContainer: {
            width: "100%",
            maxWidth: 1200,
            backgroundColor: theme.bgWhite,
            borderRadius: 12,
            overflow: "hidden",
            ...createShadow(10, theme.shadowColorMain, theme.shadowOpacityLg),
            flexDirection: isLargeDevice ? "column" : "row",
            alignSelf: "center",
        },
        authLeft: {
            flex: isLargeDevice ? 0 : 0.45,
            padding: isMediumDevice ? 24 : 48,
            backgroundColor: theme.primaryColor,
            justifyContent: "space-between",
        },
        authRight: {
            flex: isLargeDevice ? 1 : 0.55,
            padding: isMediumDevice ? 24 : 48,
            backgroundColor: theme.bgWhite,
        },

        // Branding Area
        brandArea: {
            zIndex: 2,
        },
        brandName: {
            fontSize: isMediumDevice ? 32 : 40,
            fontWeight: "700",
            color: theme.textWhite,
            marginBottom: 8,
        },
        brandTagline: {
            fontSize: 16,
            color: theme.textWhite,
            opacity: 0.9,
        },

        // Illustration
        illustration: {
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            paddingVertical: 32,
            zIndex: 2,
        },

        // Testimonial
        testimonial: {
            zIndex: 2,
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            padding: 24,
            borderRadius: 8,
            borderLeftWidth: 4,
            borderLeftColor: theme.accentColor,
            display: isMediumDevice ? "none" : "flex",
        },
        testimonialText: {
            fontSize: 15,
            fontStyle: "italic",
            marginBottom: 12,
            lineHeight: 26,
            color: theme.textWhite,
        },
        testimonialAuthor: {
            fontSize: 14,
            fontWeight: "600",
            color: theme.textWhite,
        },

        // Tabs
        authTabs: {
            flexDirection: "row",
            marginBottom: 32,
            borderBottomWidth: 1,
            borderBottomColor: "rgba(0, 0, 0, 0.1)",
        },
        authTab: {
            paddingVertical: isSmallDevice ? 12 : 16,
            paddingHorizontal: isSmallDevice ? 16 : 32,
        },
        authTabText: {
            fontSize: isSmallDevice ? 14 : 16,
            fontWeight: "500",
            color: theme.textLight,
        },
        activeTab: {
            borderBottomWidth: 3,
            borderBottomColor: theme.primaryColor,
        },
        activeTabText: {
            color: theme.primaryColor,
            fontWeight: "600",
        },

        // Form Container
        authFormContainer: {
            flex: 1,
        },
        authTitle: {
            fontSize: isSmallDevice ? 20 : 24,
            fontWeight: "600",
            marginBottom: 24,
            color: theme.textDark,
        },

        // Role Selection
        roleSelection: {
            alignItems: "center",
            paddingVertical: 24,
        },
        selectionPrompt: {
            fontSize: isSmallDevice ? 16 : 18,
            marginBottom: 24,
            color: theme.textDark,
            textAlign: "center",
        },
        roleButtons: {
            width: "100%",
            alignItems: "center",
        },
        roleBtn: {
            width: "100%",
            maxWidth: 300,
            padding: 24,
            borderRadius: 8,
            backgroundColor: theme.bgLight,
            ...createShadow(2, theme.shadowColorMain, theme.shadowOpacitySm),
            alignItems: "center",
            marginBottom: 16,
            flexDirection: "row",
            justifyContent: "center",
        },
        healthcareBtn: {
            backgroundColor: theme.primaryColor,
        },
        userBtn: {
            backgroundColor: theme.accentColor,
        },
        roleText: {
            fontWeight: "500",
            color: theme.textWhite,
            marginLeft: 12,
            fontSize: 16,
        },

        // Healthcare Type Selection
        healthcareTypeSelection: {
            paddingVertical: 24,
        },
        healthcareTypeButtons: {
            width: "100%",
            alignItems: "center",
        },
        healthcareTypeBtn: {
            width: "100%",
            maxWidth: 280,
            padding: 20,
            borderRadius: 8,
            backgroundColor: theme.bgLight,
            ...createShadow(2, theme.shadowColorMain, theme.shadowOpacitySm),
            alignItems: "center",
            marginBottom: 16,
            flexDirection: "row",
            justifyContent: "flex-start",
            paddingLeft: 32,
        },
        typeText: {
            fontWeight: "500",
            color: theme.textDark,
            marginLeft: 16,
            fontSize: 16,
        },

        // Form Elements
        authForm: {
            maxWidth: 450,
            alignSelf: "center",
            width: "100%",
        },
        formGroup: {
            marginBottom: 24,
        },
        label: {
            marginBottom: 8,
            fontWeight: "500",
            fontSize: 14,
            color: theme.textDark,
        },
        inputWrapper: {
            position: "relative",
            flexDirection: "row",
            alignItems: "center",
            borderWidth: 1,
            borderColor: "rgba(0, 0, 0, 0.1)",
            borderRadius: 8,
            backgroundColor: theme.bgWhite,
            height: 48,
        },
        inputIcon: {
            paddingLeft: 16,
            color: theme.textLight,
        },
        input: {
            flex: 1,
            height: 48,
            paddingHorizontal: 16,
            fontSize: 16,
            color: theme.textDark,
        },
        inputError: {
            flex: 1,
            height: 48,
            paddingHorizontal: 16,
            fontSize: 16,
            color: theme.textDark,
            borderColor: theme.errorColor,
        },
        passwordToggle: {
            paddingRight: 16,
        },
        errorMessage: {
            color: theme.errorColor,
            fontSize: 13,
            marginTop: 8,
        },

        // Form Options
        formOptions: {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 24,
        },
        rememberMe: {
            flexDirection: "row",
            alignItems: "center",
        },
        checkbox: {
            width: 16,
            height: 16,
            marginRight: 8,
        },
        forgotPassword: {
            color: theme.textLight,
            fontSize: 14,
        },

        // Submit Button
        submitBtn: {
            width: "100%",
            padding: 16,
            backgroundColor: theme.primaryColor,
            borderRadius: 8,
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 24,
            ...createShadow(3, theme.shadowColorMain, theme.shadowOpacityMd),
        },
        submitBtnText: {
            color: theme.textWhite,
            fontSize: 16,
            fontWeight: "600",
        },

        // Social Login
        socialLogin: {
            alignItems: "center",
            marginVertical: 24,
        },
        socialText: {
            fontSize: 14,
            color: theme.textLight,
            marginBottom: 16,
        },
        socialButtons: {
            flexDirection: "row",
            justifyContent: "center",
        },
        socialBtn: {
            flexDirection: "row",
            alignItems: "center",
            padding: 12,
            paddingHorizontal: 24,
            borderWidth: 1,
            borderColor: "rgba(0, 0, 0, 0.1)",
            borderRadius: 8,
            backgroundColor: theme.bgWhite,
        },
        socialBtnText: {
            color: theme.textDark,
            fontSize: 14,
            marginLeft: 8,
        },

        // Back Button
        backButton: {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            marginTop: 16,
            padding: 8,
            paddingHorizontal: 16,
            borderWidth: 1,
            borderColor: "rgba(0, 0, 0, 0.1)",
            borderRadius: 8,
            alignSelf: "center",
        },
        backButtonText: {
            color: theme.textLight,
            fontSize: 14,
            marginLeft: 8,
        },

        // Terms Checkbox
        termsCheckbox: {
            flexDirection: "row",
            alignItems: "flex-start",
            marginBottom: 24,
        },
        termsLabel: {
            fontSize: 14,
            color: theme.textDark,
            flex: 1,
            marginLeft: 8,
        },
        termsLink: {
            color: theme.primaryColor,
            fontWeight: "500",
        },

        // Animation classes (for future use with Animated API)
        formFadeIn: {
            opacity: 1,
        },
    });

// Main Component
export default function Login() {
    const colorScheme = useColorScheme() || "light";
    const theme = colorScheme === "dark" ? darkTheme : lightTheme;
    const styles = createStyles(theme);

    // States
    const [activeTab, setActiveTab] = useState("login");
    const [role, setRole] = useState("");
    const [healthcareType, setHealthcareType] = useState("");
    const [showHealthcareTypes, setShowHealthcareTypes] = useState(false);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [formAnimationClass, setFormAnimationClass] = useState("");
    const [rememberMe, setRememberMe] = useState(false);

    // Replace context with direct state
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isDoctor, setIsDoctor] = useState(false);
    const [user, setUser] = useState<User | null>(null);

    // Form data state
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    // Error state
    const [errors, setErrors] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    // Animation effect
    useEffect(() => {
        setFormAnimationClass("form-fade-in");
        const timer = setTimeout(() => {
            setFormAnimationClass("");
        }, 500);

        return () => clearTimeout(timer);
    }, [activeTab, role, healthcareType]);

    // Input change handler
    const handleInputChange = (
        value: string,
        fieldName: keyof typeof formData
    ) => {
        setFormData({
            ...formData,
            [fieldName]: value,
        });

        if (errors[fieldName]) {
            setErrors({
                ...errors,
                [fieldName]: "",
            });
        }
    };

    // Form validation
    const validateForm = () => {
        let isValid = true;
        const newErrors = { ...errors };

        // Username validation
        if (activeTab === "register" && !formData.username.trim()) {
            newErrors.username = "Username is required";
            isValid = false;
        } else if (activeTab === "register" && formData.username.length < 3) {
            newErrors.username = "Username must be at least 3 characters";
            isValid = false;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
            isValid = false;
        } else if (!emailRegex.test(formData.email)) {
            newErrors.email = "Please enter a valid email address";
            isValid = false;
        }

        // Password validation
        if (!formData.password) {
            newErrors.password = "Password is required";
            isValid = false;
        } else if (formData.password.length < 6) {
            newErrors.password = "Password must be at least 6 characters";
            isValid = false;
        }

        // Confirm password validation
        if (
            activeTab === "register" &&
            formData.password !== formData.confirmPassword
        ) {
            newErrors.confirmPassword = "Passwords do not match";
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    // Login handler
    const handleLogin = async () => {
        if (!validateForm()) return;

        const loginData = {
            email: formData.email,
            password: formData.password,
        };

        let LOGIN_API_URL = "http://localhost:8080/user/login";

        if (role === "healthcare") {
            if (healthcareType === "doctor") {
                LOGIN_API_URL = "http://localhost:8080/doctor/login";
            } else if (healthcareType === "pharmacist") {
                LOGIN_API_URL = "http://localhost:8080/pharmacist/login";
            } else if (healthcareType === "diagnostics") {
                LOGIN_API_URL = "http://localhost:8080/diagnostics/login";
            } else {
                LOGIN_API_URL = "http://localhost:8080/healthcare/login";
            }
        }

        try {
            const response = await fetch(LOGIN_API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(loginData),
            });

            if (response.ok) {
                const data = await response.json();
                setUser({
                    email: formData.email,
                    role: role === "healthcare" ? healthcareType : "user",
                });
                setIsDoctor(role === "healthcare" && healthcareType === "doctor");
                setIsLoggedIn(true);

                showNotification("Login successful! Welcome back.", "success");

                // Navigation commented out, since this is the only file
                // if (role === "healthcare") {
                //   if (healthcareType === "doctor") {
                //     router.push({
                //       pathname: "/doctorVerificationpage",
                //       params: { email: formData.email },
                //     });
                //   } else {
                //     router.push("/healthcare-dashboard");
                //   }
                // } else {
                //   router.push("/findDoctorPage");
                // }
            } else {
                const errorMessage = await response.text();
                showNotification(`Login failed: ${errorMessage}`, "error");
            }
        } catch (error) {
            console.error("Login error:", error);
            showNotification(
                "An error occurred during login. Please try again.",
                "error"
            );
        }
    };

    // Register handler
    const handleRegister = async () => {
        if (!validateForm()) return;

        if (formData.password !== formData.confirmPassword) {
            setErrors({
                ...errors,
                confirmPassword: "Passwords do not match",
            });
            return;
        }

        const registerData = {
            username: formData.username,
            email: formData.email,
            password: formData.password,
            role: role === "healthcare" ? healthcareType || "other" : "user",
        };

        let REGISTER_API_URL = "http://localhost:8080/user/register";

        if (role === "healthcare") {
            if (healthcareType === "doctor") {
                REGISTER_API_URL = "http://localhost:8080/doctor/register";
            } else if (healthcareType === "pharmacist") {
                REGISTER_API_URL = "http://localhost:8080/pharmacist/register";
            } else if (healthcareType === "diagnostics") {
                REGISTER_API_URL = "http://localhost:8080/diagnostics/register";
            } else {
                REGISTER_API_URL = "http://localhost:8080/healthcare/register";
            }
        }

        try {
            const response = await fetch(REGISTER_API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(registerData),
            });

            if (response.ok) {
                setUser({
                    email: formData.email,
                    role: role === "healthcare" ? healthcareType : "user",
                });
                setIsDoctor(role === "healthcare" && healthcareType === "doctor");
                setIsLoggedIn(true);

                showNotification(
                    "Registration successful! You can now log in.",
                    "success"
                );
                setFormData({
                    username: "",
                    email: "",
                    password: "",
                    confirmPassword: "",
                });
                setRole("");
                setHealthcareType("");
                setActiveTab("login");
                // Navigation commented out, since this is the only file
                // router.push("/login");
            } else {
                const errorMessage = await response.text();
                showNotification(`Registration failed: ${errorMessage}`, "error");
            }
        } catch (error) {
            console.error("Registration error:", error);
            showNotification("An error occurred during registration.", "error");
        }
    };

    // Notification function
    const showNotification = (message: string, type: string) => {
        Alert.alert(type === "success" ? "Success" : "Error", message, [
            { text: "OK" },
        ]);
    };

    // Tab switching functions
    const showLogin = () => {
        setActiveTab("login");
        setRole("");
        setHealthcareType("");
        setShowHealthcareTypes(false);
    };

    const showRegister = () => {
        setActiveTab("register");
        setRole("");
        setHealthcareType("");
        setShowHealthcareTypes(false);
    };

    const showDoctorForm = () => {
        setRole("healthcare");
        setShowHealthcareTypes(true);
    };

    const showUserForm = () => {
        setRole("user");
        setShowHealthcareTypes(false);
    };

    const selectHealthcareType = (type: string) => {
        setHealthcareType(type);
        setShowHealthcareTypes(false);
    };

    const goBack = () => {
        if (showHealthcareTypes) {
            setShowHealthcareTypes(false);
            setRole("");
        } else if (healthcareType) {
            setHealthcareType("");
            setShowHealthcareTypes(true);
        } else {
            setRole("");
        }
    };

    const togglePasswordVisibility = () => {
        setIsPasswordVisible(!isPasswordVisible);
    };

    return (
        <View style={styles.authPage}>
            <View style={styles.authContainer}>
                <View style={styles.authLeft}>
                    <View style={styles.brandArea}>
                        <Text style={styles.brandName}>Verified Health Care</Text>
                        <Text style={styles.brandTagline}>Your Health, Our Priority</Text>
                    </View>
                    {/* Image placeholder - No image used, self-contained file */}
                    <View style={styles.illustration}>
                        {/* No image, self-contained */}
                    </View>
                    <View style={styles.testimonial}>
                        <Text style={styles.testimonialText}>
                            Verified Health Care transformed how I connect with my patients.
                            Highly recommended for all healthcare professionals!
                        </Text>
                        <Text style={styles.testimonialAuthor}>
                            Dr. SeethaRam, Cardiologist
                        </Text>
                    </View>
                </View>

                <View style={styles.authRight}>
                    <View style={styles.authTabs}>
                        <TouchableOpacity
                            style={[
                                styles.authTab,
                                activeTab === "login" && styles.activeTab,
                            ]}
                            onPress={showLogin}
                        >
                            <Text
                                style={[
                                    styles.authTabText,
                                    activeTab === "login" && styles.activeTabText,
                                ]}
                            >
                                Login
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[
                                styles.authTab,
                                activeTab === "register" && styles.activeTab,
                            ]}
                            onPress={showRegister}
                        >
                            <Text
                                style={[
                                    styles.authTabText,
                                    activeTab === "register" && styles.activeTabText,
                                ]}
                            >
                                Register
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <View
                        style={[
                            styles.authFormContainer,
                            formAnimationClass && styles.formFadeIn,
                        ]}
                    >
                        <Text style={styles.authTitle}>
                            {activeTab === "login" ? "Welcome Back" : "Create Your Account"}
                            {role &&
                                activeTab === "login" &&
                                ` | ${
                                    role === "healthcare" ? "Healthcare Professional" : "User"
                                }`}
                            {role &&
                                activeTab === "register" &&
                                ` | ${
                                    role === "healthcare" ? "Healthcare Professional" : "User"
                                }`}
                            {healthcareType &&
                                ` | ${
                                    healthcareType.charAt(0).toUpperCase() +
                                    healthcareType.slice(1)
                                }`}
                        </Text>

                        {/* Role Selection */}
                        {!role && (
                            <View style={styles.roleSelection}>
                                <Text style={styles.selectionPrompt}>
                                    {activeTab === "login"
                                        ? "Select your role to continue:"
                                        : "I would like to register as:"}
                                </Text>
                                <View style={styles.roleButtons}>
                                    <TouchableOpacity
                                        style={[styles.roleBtn, styles.healthcareBtn]}
                                        onPress={showDoctorForm}
                                    >
                                        <Text style={{ marginRight: 8, color: "#fff" }}>🩺</Text>
                                        <Text style={styles.roleText}>Healthcare Professional</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={[styles.roleBtn, styles.userBtn]}
                                        onPress={showUserForm}
                                    >
                                        <Text style={{ marginRight: 8, color: "#fff" }}>👤</Text>
                                        <Text style={styles.roleText}>User</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        )}

                        {/* Healthcare Type Selection */}
                        {role === "healthcare" && showHealthcareTypes && (
                            <View style={styles.healthcareTypeSelection}>
                                <Text style={styles.selectionPrompt}>
                                    What type of healthcare professional are you?
                                </Text>
                                <View style={styles.healthcareTypeButtons}>
                                    <TouchableOpacity
                                        style={styles.healthcareTypeBtn}
                                        onPress={() => selectHealthcareType("doctor")}
                                    >
                                        <Text style={{ marginRight: 8, color: "#3498db" }}>🩺</Text>
                                        <Text style={styles.typeText}>Doctor</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={styles.healthcareTypeBtn}
                                        onPress={() => selectHealthcareType("diagnostics")}
                                    >
                                        <Text style={{ marginRight: 8, color: "#3498db" }}>🏥</Text>
                                        <Text style={styles.typeText}>Diagnostics</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={styles.healthcareTypeBtn}
                                        onPress={() => selectHealthcareType("pharmacist")}
                                    >
                                        <Text style={{ marginRight: 8, color: "#3498db" }}>💊</Text>
                                        <Text style={styles.typeText}>Pharmacist</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={styles.healthcareTypeBtn}
                                        onPress={() => selectHealthcareType("other")}
                                    >
                                        <Text style={{ marginRight: 8, color: "#3498db" }}>👨‍⚕️</Text>
                                        <Text style={styles.typeText}>Other Healthcare</Text>
                                    </TouchableOpacity>
                                </View>

                                <TouchableOpacity style={styles.backButton} onPress={goBack}>
                                    <Text style={{ marginRight: 8, color: "#555" }}>←</Text>
                                    <Text style={styles.backButtonText}>Back</Text>
                                </TouchableOpacity>
                            </View>
                        )}

                        {/* Login Form */}
                        {activeTab === "login" && role && !showHealthcareTypes && (
                            <View style={styles.authForm}>
                                <View style={styles.formGroup}>
                                    <Text style={styles.label}>Email</Text>
                                    <View style={styles.inputWrapper}>
                                        <Text style={{ marginRight: 8, color: "#666" }}>📧</Text>
                                        <TextInput
                                            style={errors.email ? styles.inputError : styles.input}
                                            placeholder="Enter your email"
                                            value={formData.email}
                                            onChangeText={(text) => handleInputChange(text, "email")}
                                            keyboardType="email-address"
                                            autoCapitalize="none"
                                        />
                                    </View>
                                    {errors.email && (
                                        <Text style={styles.errorMessage}>{errors.email}</Text>
                                    )}
                                </View>

                                <View style={styles.formGroup}>
                                    <Text style={styles.label}>Password</Text>
                                    <View style={styles.inputWrapper}>
                                        <Text style={{ marginRight: 8, color: "#666" }}>🔒</Text>
                                        <TextInput
                                            style={errors.password ? styles.inputError : styles.input}
                                            secureTextEntry={!isPasswordVisible}
                                            placeholder="Enter your password"
                                            value={formData.password}
                                            onChangeText={(text) =>
                                                handleInputChange(text, "password")
                                            }
                                        />
                                        <TouchableOpacity
                                            style={styles.passwordToggle}
                                            onPress={togglePasswordVisibility}
                                        >
                                            <Text style={{ marginRight: 8, color: "#666" }}>
                                                {isPasswordVisible ? "👁️" : "🙈"}
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                    {errors.password && (
                                        <Text style={styles.errorMessage}>{errors.password}</Text>
                                    )}
                                </View>

                                <View style={styles.formOptions}>
                                    <View style={styles.rememberMe}>
                                        <CheckBox
                                            value={rememberMe}
                                            onValueChange={setRememberMe}
                                            style={styles.checkbox}
                                        />
                                        <Text style={styles.label}>Remember me</Text>
                                    </View>
                                    <Text style={styles.forgotPassword}>Forgot password?</Text>
                                </View>

                                <TouchableOpacity
                                    style={styles.submitBtn}
                                    onPress={handleLogin}
                                >
                                    <Text style={styles.submitBtnText}>Login</Text>
                                </TouchableOpacity>

                                <View style={styles.socialLogin}>
                                    <Text style={styles.socialText}>Or continue with</Text>
                                    <View style={styles.socialButtons}>
                                        <TouchableOpacity style={styles.socialBtn}>
                                            <Text style={styles.socialBtnText}>Google</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                <TouchableOpacity style={styles.backButton} onPress={goBack}>
                                    <Text style={{ marginRight: 8, color: "#555" }}>←</Text>
                                    <Text style={styles.backButtonText}>Back</Text>
                                </TouchableOpacity>
                            </View>
                        )}

                        {/* Register Form */}
                        {activeTab === "register" && role && !showHealthcareTypes && (
                            <View style={styles.authForm}>
                                <View style={styles.formGroup}>
                                    <Text style={styles.label}>Full Name</Text>
                                    <View style={styles.inputWrapper}>
                                        <Text style={{ marginRight: 8, color: "#666" }}>👤</Text>
                                        <TextInput
                                            style={errors.username ? styles.inputError : styles.input}
                                            placeholder="Enter your full name"
                                            value={formData.username}
                                            onChangeText={(text) =>
                                                handleInputChange(text, "username")
                                            }
                                        />
                                    </View>
                                    {errors.username && (
                                        <Text style={styles.errorMessage}>{errors.username}</Text>
                                    )}
                                </View>

                                <View style={styles.formGroup}>
                                    <Text style={styles.label}>Email</Text>
                                    <View style={styles.inputWrapper}>
                                        <Text style={{ marginRight: 8, color: "#666" }}>📧</Text>
                                        <TextInput
                                            style={errors.email ? styles.inputError : styles.input}
                                            placeholder="Enter your email"
                                            value={formData.email}
                                            onChangeText={(text) => handleInputChange(text, "email")}
                                            keyboardType="email-address"
                                            autoCapitalize="none"
                                        />
                                    </View>
                                    {errors.email && (
                                        <Text style={styles.errorMessage}>{errors.email}</Text>
                                    )}
                                </View>

                                <View style={styles.formGroup}>
                                    <Text style={styles.label}>Password</Text>
                                    <View style={styles.inputWrapper}>
                                        <Text style={{ marginRight: 8, color: "#666" }}>🔒</Text>
                                        <TextInput
                                            style={errors.password ? styles.inputError : styles.input}
                                            secureTextEntry={!isPasswordVisible}
                                            placeholder="Create a password"
                                            value={formData.password}
                                            onChangeText={(text) =>
                                                handleInputChange(text, "password")
                                            }
                                        />
                                        <TouchableOpacity
                                            style={styles.passwordToggle}
                                            onPress={togglePasswordVisibility}
                                        >
                                            <Text style={{ marginRight: 8, color: "#666" }}>
                                                {isPasswordVisible ? "👁️" : "🙈"}
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                    {errors.password && (
                                        <Text style={styles.errorMessage}>{errors.password}</Text>
                                    )}
                                </View>

                                <View style={styles.formGroup}>
                                    <Text style={styles.label}>Confirm Password</Text>
                                    <View style={styles.inputWrapper}>
                                        <Text style={{ marginRight: 8, color: "#666" }}>🔒</Text>
                                        <TextInput
                                            style={
                                                errors.confirmPassword
                                                    ? styles.inputError
                                                    : styles.input
                                            }
                                            secureTextEntry={!isPasswordVisible}
                                            placeholder="Confirm your password"
                                            value={formData.confirmPassword}
                                            onChangeText={(text) =>
                                                handleInputChange(text, "confirmPassword")
                                            }
                                        />
                                    </View>
                                    {errors.confirmPassword && (
                                        <Text style={styles.errorMessage}>
                                            {errors.confirmPassword}
                                        </Text>
                                    )}
                                </View>

                                <View style={styles.termsCheckbox}>
                                    <CheckBox
                                        value={false}
                                        onValueChange={() => {}}
                                        style={styles.checkbox}
                                    />
                                    <Text style={styles.termsLabel}>
                                        I agree to the
                                        <Text style={styles.termsLink}> Terms of Service </Text>
                                        and
                                        <Text style={styles.termsLink}> Privacy Policy</Text>
                                    </Text>
                                </View>

                                <TouchableOpacity
                                    style={styles.submitBtn}
                                    onPress={handleRegister}
                                >
                                    <Text style={styles.submitBtnText}>Create Account</Text>
                                </TouchableOpacity>

                                <TouchableOpacity style={styles.backButton} onPress={goBack}>
                                    <Text style={{ marginRight: 8, color: "#555" }}>←</Text>
                                    <Text style={styles.backButtonText}>Back</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>
                </View>
            </View>
        </View>
    );
}

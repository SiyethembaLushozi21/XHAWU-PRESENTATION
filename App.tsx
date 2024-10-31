import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { ImageBackground, View, Text, Button, Image, StyleSheet, TouchableOpacity, TextInput, Alert, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Formik } from 'formik';
import * as Yup from 'yup';
import * as ImagePicker from 'expo-image-picker';

const Stack = createStackNavigator();

const coursePrices: Record<string, number> = {
  "First Aid": 1500,
  "Sewing": 1500,
  "Life Skills": 1500,
  "Landscaping": 1500,
  "Child Minding": 750,
  "Cooking": 750,
  "Garden Maintaining": 750,
};

const courseImages: Record<string, any> = {
  "First Aid": require('./assets/firstaid.png'),
  "Sewing": require('./assets/sewing.png'),
  "Life Skills": require('./assets/lifeskills.png'),
  "Landscaping": require('./assets/landscaping.png'),
  "Child Minding": require('./assets/childminding.png'),
  "Cooking": require('./assets/cooking.png'),
  "Garden Maintaining": require('./assets/gardening.png'),
};

 const SplashScreen = ({ navigation }: { navigation: any }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.navigate('Login');
    }, 2000);
    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#32ADE6', // Background color
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <ImageBackground
        source={require('./assets/splashscreen.png')}
        style={{
          width: '100%', // Full width of the screen
          height: '50%', // Half height of the screen
        }}
        resizeMode="contain" // Keep the aspect ratio of the image
      />
    </View>
  );
};
const LoginScreen = ({ navigation }: { navigation: any }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (values: { username: string; password: string }) => {
    setIsLoading(true);
    try {
      const storedUser = await AsyncStorage.getItem('user');
      const user = storedUser ? JSON.parse(storedUser) : null;

      if (user && user.username === values.username && user.password === values.password) {
        Alert.alert("Success", "Logged in successfully!");
        navigation.navigate('Home');
      } else {
        Alert.alert("Error", "Invalid username or password.");
      }
    } catch (error) {
      Alert.alert("Error", "An error occurred during login.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#32ADE6',
      padding: 20,
    }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', width: '100%' }}>
        {/* Logo at the top */}
        <View style={{ alignItems: 'center', marginBottom: 30 }}>
          <Image
            source={require('./assets/logo.png')}  // Adjust the path to your logo image
            style={{ width: 330, height: 200 }}
          />
        </View>

        {/* Empowering the Nation Text */}
        <Text style={{
          fontSize: 24, // Size for visibility
          fontWeight: 'bold',
          color: '#fff',
          marginBottom: 20,
          textAlign: 'center',
        }}>
          Empowering the Nation
        </Text>

        {/* Login Form */}
        <Formik
          initialValues={{ username: '', password: '' }}
          onSubmit={handleLogin}
          validationSchema={Yup.object().shape({
            username: Yup.string().required('Please enter your username or email.'),
            password: Yup.string().required('Please enter your password.'),
          })}
        >
          {({ handleChange, handleSubmit, errors, touched }) => (
            <View style={{ width: '100%' }}>
              {/* Username Input */}
              <TextInput
                placeholder="Username or Email"
                onChangeText={handleChange('username')}
                style={{
                  height: 50,
                  borderColor: '#fff',
                  borderWidth: 1,
                  paddingHorizontal: 15,
                  marginBottom: 10,
                  borderRadius: 8,
                  backgroundColor: '#fff',
                  color: '#000',
                }}
                placeholderTextColor="#888"
              />
              {errors.username && touched.username && (
                <Text style={{ color: 'red', marginBottom: 10 }}>{errors.username}</Text>
              )}

              {/* Password Input */}
              <TextInput
                placeholder="Password"
                onChangeText={handleChange('password')}
                secureTextEntry
                style={{
                  height: 50,
                  borderColor: '#fff',
                  borderWidth: 1,
                  paddingHorizontal: 15,
                  marginBottom: 10,
                  borderRadius: 8,
                  backgroundColor: '#fff',
                  color: '#000',
                }}
                placeholderTextColor="#888"
              />
              {errors.password && touched.password && (
                <Text style={{ color: 'red', marginBottom: 10 }}>{errors.password}</Text>
              )}

              {/* Login Button */}
              <TouchableOpacity
                onPress={handleSubmit as any}
                style={{
                  backgroundColor: isLoading ? '#777' : '#000',
                  paddingVertical: 15,
                  borderRadius: 8,
                  alignItems: 'center',
                  marginBottom: 15,
                }}
                disabled={isLoading}
              >
                <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>
                  {isLoading ? "Logging in..." : "Login"}
                </Text>
              </TouchableOpacity>

              {/* Navigate to Register */}
              <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                <Text style={{ color: '#fff', textAlign: 'center', textDecorationLine: 'underline' }}>
                  Don't have an account? Register
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </Formik>
      </ScrollView>
    </View>
  );
};



const RegisterScreen = ({ navigation }: { navigation: any }) => {
  const [profileImage, setProfileImage] = useState<string | null>(null);

  const handleImagePick = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert("Permission to access camera roll is required!");
      return;
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync();
    if (!pickerResult.cancelled) {
      setProfileImage(pickerResult.uri);
    }
  };

  const handleRegister = async (values: { username: string; email: string; password: string }) => {
    await AsyncStorage.setItem('user', JSON.stringify(values));
    Alert.alert("Success", "Account created successfully!");
    navigation.navigate('Login');
  };

  return (
    <Formik
      initialValues={{ username: '', email: '', password: '', confirmPassword: '' }}
      onSubmit={handleRegister}
      validationSchema={Yup.object().shape({
        username: Yup.string().required('Please enter username'),
        email: Yup.string().email('Invalid email').required('Please enter email'),
        password: Yup.string().min(6, 'Password must be at least 6 characters').required('Please enter password'),
        confirmPassword: Yup.string()
          .oneOf([Yup.ref('password'), null], 'Passwords must match')
          .required('Please confirm your password'),
      })}
    >
      {({ handleChange, handleSubmit, errors, touched }) => (
        <View style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          padding: 20,
          backgroundColor: '#32ADE6',
        }}>
          <Text style={{
            fontSize: 26,
            fontWeight: 'bold',
            color: '#fff',
            marginBottom: 30,
          }}>Create an Account</Text>

          {/* Profile Picture Picker */}
          <TouchableOpacity onPress={handleImagePick}>
            <View style={{
              width: 120,
              height: 120,
              borderRadius: 60,
              borderWidth: 1,
              borderColor: '#fff',
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: 20,
              backgroundColor: '#fff',
            }}>
              {profileImage ? (
                <Image source={{ uri: profileImage }} style={{
                  width: 120,
                  height: 120,
                  borderRadius: 60,
                }} />
              ) : (
                <Text style={{ color: '#888' }}>Pick Profile Image</Text>
              )}
            </View>
          </TouchableOpacity>

          {/* Username Input */}
          <TextInput
            placeholder="Username"
            onChangeText={handleChange('username')}
            style={{
              height: 50,
              width: '100%',
              borderColor: '#fff',
              borderWidth: 1,
              paddingHorizontal: 15,
              marginBottom: 10,
              borderRadius: 8,
              backgroundColor: '#fff',
              color: '#000',
            }}
            placeholderTextColor="#888"
          />
          {errors.username && touched.username && <Text style={{ color: 'red', marginBottom: 10 }}>{errors.username}</Text>}

          {/* Email Input */}
          <TextInput
            placeholder="Email"
            onChangeText={handleChange('email')}
            keyboardType="email-address"
            style={{
              height: 50,
              width: '100%',
              borderColor: '#fff',
              borderWidth: 1,
              paddingHorizontal: 15,
              marginBottom: 10,
              borderRadius: 8,
              backgroundColor: '#fff',
              color: '#000',
            }}
            placeholderTextColor="#888"
          />
          {errors.email && touched.email && <Text style={{ color: 'red', marginBottom: 10 }}>{errors.email}</Text>}

          {/* Password Input */}
          <TextInput
            placeholder="Password"
            onChangeText={handleChange('password')}
            secureTextEntry
            style={{
              height: 50,
              width: '100%',
              borderColor: '#fff',
              borderWidth: 1,
              paddingHorizontal: 15,
              marginBottom: 10,
              borderRadius: 8,
              backgroundColor: '#fff',
              color: '#000',
            }}
            placeholderTextColor="#888"
          />
          {errors.password && touched.password && <Text style={{ color: 'red', marginBottom: 10 }}>{errors.password}</Text>}

          {/* Confirm Password Input */}
          <TextInput
            placeholder="Confirm Password"
            onChangeText={handleChange('confirmPassword')}
            secureTextEntry
            style={{
              height: 50,
              width: '100%',
              borderColor: '#fff',
              borderWidth: 1,
              paddingHorizontal: 15,
              marginBottom: 10,
              borderRadius: 8,
              backgroundColor: '#fff',
              color: '#000',
            }}
            placeholderTextColor="#888"
          />
          {errors.confirmPassword && touched.confirmPassword && <Text style={{ color: 'red', marginBottom: 10 }}>{errors.confirmPassword}</Text>}

          {/* Register Button */}
          <TouchableOpacity
            onPress={handleSubmit as any}
            style={{
              backgroundColor: '#000',
              width: '100%',
              padding: 15,
              borderRadius: 8,
              alignItems: 'center',
              marginTop: 10,
            }}
          >
            <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>Register</Text>
          </TouchableOpacity>

          {/* Navigate to Login */}
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={{ marginTop: 20, color: '#fff', textDecorationLine: 'underline' }}>
              Already have an account? Log in
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </Formik>
  );
};


const HomeScreen = ({ navigation }: { navigation: any }) => (
  <View style={{
    flex: 1,
    backgroundColor: '#32ADE6',
    padding: 20,
    justifyContent: 'flex-start',
    alignItems: 'center',
  }}>
    {/* Welcome Message */}
    <Text style={{
      fontSize: 36,
      fontWeight: 'bold',
      color: '#fff',
      marginBottom: 20,
      textAlign: 'center',
      fontFamily: 'Arial, sans-serif', // Optional: Change to a more futuristic font if available
    }}>
      Welcome to Our App
    </Text>

    {/* Image Below the Welcome Message */}
    <Image
      source={require('./assets/logo.png')} // Adjust the path to your welcome image
      style={{
        width: '50%',
        height: 100, // Adjust height based on your design preference
        borderRadius: 15, // Rounded edges for a modern look
        marginBottom: 30,
        resizeMode: 'cover',
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.3,
        shadowRadius: 3.84,
        elevation: 5,
      }}
    />

    <Text style={{
      fontSize: 28,
      fontWeight: 'bold',
      color: '#fff',
      marginBottom: 20,
      textAlign: 'center',
    }}>
      Select a Course
    </Text>

    {/* Course Options */}
    <View style={{
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 30,
      width: '100%',
    }}>
      <CourseOption 
        title="Six-Month Courses" 
        image={require('./assets/sixMonthCourses.jpg')} 
        onPress={() => navigation.navigate('SixMonthCourses')}
      />
      <CourseOption 
        title="Six-Week Courses" 
        image={require('./assets/sixWeekCourses.jpg')} 
        onPress={() => navigation.navigate('SixWeekCourses')}
      />
    </View>

    {/* Navigation Buttons */}
    <View style={{
      width: '100%',
      justifyContent: 'space-around',
    }}>
      <CustomButton title="About Us" onPress={() => navigation.navigate('AboutUs')} />
      <CustomButton title="Contact Us" onPress={() => navigation.navigate('ContactUs')} />
      <CustomButton title="Calculate Fees" onPress={() => navigation.navigate('CalculateFees')} />
    </View>
  </View>
);


// Course Option Component
const CourseOption = ({ title, image, onPress }: { title: string; image: any; onPress: () => void }) => (
  <TouchableOpacity style={{
    width: '45%',
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
    padding: 10,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  }} onPress={onPress}>
    <Image source={image} style={{
      width: '100%',
      height: 150,
      borderRadius: 10,
      marginBottom: 10,
    }} />
    <Text style={{
      fontSize: 16,
      fontWeight: 'bold',
      textAlign: 'center',
      color: '#000',
    }}>{title}</Text>
  </TouchableOpacity>
);

// Custom Button Component
const CustomButton = ({ title, onPress }: { title: string; onPress: () => void }) => (
  <TouchableOpacity onPress={onPress} style={styles.button}>
    <Text style={styles.buttonText}>{title}</Text>
  </TouchableOpacity>
);

// Six-Month Courses Screen
const SixMonthCoursesScreen = ({ navigation }: { navigation: any }) => {
  const courses = ["First Aid", "Sewing", "Life Skills", "Landscaping"];

  return (
    <View style={{ flex: 1, backgroundColor: '#32ADE6', padding: 20 }}>
      <Text style={{
        fontSize: 32,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 20,
        textAlign: 'center'
      }}>Six-Month Courses</Text>
      <ScrollView>
        {courses.map((course, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => navigation.navigate('CourseDetails', { course })}
            style={{
              backgroundColor: '#fff',
              borderRadius: 10,
              padding: 15,
              marginBottom: 10,
              shadowColor: '#000',
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.3,
              shadowRadius: 3.84,
              elevation: 5,
            }}
          >
            <Text style={{
              fontSize: 20,
              fontWeight: 'bold',
              color: '#333'
            }}>{course}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

// Six-Week Courses Screen
const SixWeekCoursesScreen = ({ navigation }: { navigation: any }) => {
  const courses = ["Child Minding", "Cooking", "Garden Maintaining"];

  return (
    <View style={{ flex: 1, backgroundColor: '#32ADE6', padding: 20 }}>
      <Text style={{
        fontSize: 32,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 20,
        textAlign: 'center'
      }}>Six-Week Courses</Text>
      <ScrollView>
        {courses.map((course, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => navigation.navigate('CourseDetails', { course })}
            style={{
              backgroundColor: '#fff',
              borderRadius: 10,
              padding: 15,
              marginBottom: 10,
              shadowColor: '#000',
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.3,
              shadowRadius: 3.84,
              elevation: 5,
            }}
          >
            <Text style={{
              fontSize: 20,
              fontWeight: 'bold',
              color: '#333'
            }}>{course}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};



const CoursesListScreen = ({ title, courses, navigation }: { title: string; courses: string[]; navigation: any }) => (
  <View style={{
    flex: 1,
    padding: 20,
    backgroundColor: '#32ADE6',
  }}>
    <Text style={{
      fontSize: 28,
      fontWeight: 'bold',
      color: '#fff',
      textAlign: 'center',
      marginBottom: 20,
    }}>
      {title}
    </Text>

    <View style={{
      flex: 1,
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
    }}>
      {courses.map((course) => (
        <View key={course} style={{
          marginBottom: 20,
          width: '48%', // Card width to allow for two columns
          borderRadius: 10,
          overflow: 'hidden',
          backgroundColor: '#fff',
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.3,
          shadowRadius: 3.84,
          elevation: 5,
        }}>
          <TouchableOpacity 
            onPress={() => navigation.navigate('CourseDetails', { course })} // Navigate to course details
            style={{
              padding: 15,
              alignItems: 'center',
            }}
          >
            <Image source={courseImages[course]} style={{
              width: '100%',
              height: 120,
              borderRadius: 10,
              marginBottom: 10,
            }} />
            <Text style={{
              fontSize: 18,
              fontWeight: 'bold',
              color: '#333',
              textAlign: 'center',
            }}>
              {course}
            </Text>
            <Text style={{
              fontSize: 16,
              color: '#333',
              textAlign: 'center',
            }}>
              Price: {coursePrices[course]} {/* Ensure coursePrices is defined and contains prices */}
            </Text>
          </TouchableOpacity>
        </View>
      ))}
    </View>
  </View>
);



// Course Card Component
const CourseCard = ({ course, price, image, navigation }: { course: string; price: number; image: any; navigation: any }) => (
  <TouchableOpacity 
    style={styles.courseCardContainer} 
    onPress={() => navigation.navigate('CourseDetails', { course })}
  >
    <Image source={image} style={styles.courseImage} />
    <View style={styles.courseInfo}>
      <Text style={styles.courseName}>{course}</Text>
      <Text style={styles.coursePrice}>{price} R</Text>
    </View>
    <TouchableOpacity 
      style={styles.detailsButton} 
      onPress={() => navigation.navigate('CourseDetails', { course })}
    >
      <Text style={styles.detailsButtonText}>Details</Text>
    </TouchableOpacity>
  </TouchableOpacity>
);

const CourseDetailsScreen = ({ route, navigation }: { route: any; navigation: any }) => {
  const { course } = route.params;
  const [isEnrolled, setIsEnrolled] = useState(false);

  useEffect(() => {
    const checkEnrollment = async () => {
      const storedCourses = await AsyncStorage.getItem('selectedCourses');
      const enrolledCourses = storedCourses ? JSON.parse(storedCourses) : [];
      setIsEnrolled(enrolledCourses.includes(course));
    };
    checkEnrollment();
  }, [course]);

  const handleEnroll = async () => {
    const storedCourses = await AsyncStorage.getItem('selectedCourses');
    let enrolledCourses = storedCourses ? JSON.parse(storedCourses) : [];

    if (isEnrolled) {
      enrolledCourses = enrolledCourses.filter((c: string) => c !== course);
    } else {
      enrolledCourses.push(course);
    }

    await AsyncStorage.setItem('selectedCourses', JSON.stringify(enrolledCourses));
    setIsEnrolled(!isEnrolled);
  };

  const courseDetails = {
    "First Aid": { 
      purpose: "We offer this course to provide first aid awareness and basic life support.", 
      fees: "R1500",
      content: [
        "Wounds and bleeding", 
        "Burns and fractures", 
        "Emergency scene management", 
        "Cardio-Pulmonary Resuscitation (CPR)"
      ] 
    },
    "Sewing": { 
      purpose: "We offer this course to provide alterations and new garment tailoring services.", 
      fees: "R1500",
      content: [
        "Types of stitches", 
        "Threading a sewing machine", 
        "Sewing buttons, zips, hems, and seams", 
        "Alterations", 
        "Designing and sewing new garments" 
      ] 
    },
    "Life Skills": { 
      purpose: "We offer this course to provide skills to navigate basic life necessities.", 
      fees: "R1500",
      content: [
        "Opening a bank account", 
        "Basic labor law", 
        "Basic reading and writing literacy", 
        "Basic numeric literacy"
      ] 
    },
    "Landscaping": { 
      purpose: "We provide this course to provide landscaping service for new and established gardens.", 
      fees: "R1500",
      content: [
        "Indigenous and exotic plants and trees", 
        "Fixed structures", 
        "Balancing of plants and trees in the garden"
      ] 
    },
    "Child Minding": { 
      purpose: "This course provides skills to navigate basic life.", 
      fees: "R750",
      content: [
        "Birth to six-month old baby needs", 
        "Seven-month to one-year old needs", 
        "Toddler needs", 
        "Educational toys"
      ] 
    },
    "Cooking": { 
      purpose: "This course prepares students to cook nutritious family meals.", 
      fees: "R750",
      content: [
        "Nutritional requirements for a healthy body", 
        "Types of protein, carbohydrates, and vegetables", 
        "Planning meals", 
        "Educational toys"
      ] 
    },
    "Garden Maintaining": { 
      purpose: "This course provides basic knowledge of watering, pruning, and planting for students.", 
      fees: "R750",
      content: [
        "Water restriction and the watering requirements", 
        "Pruning and propagation of plants", 
        "Planting techniques for different plant types"
      ] 
    },
  };

  // Check if course exists in courseDetails
  if (!courseDetails[course]) {
    return (
      <View style={{ flex: 1, backgroundColor: '#32ADE6', justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: '#fff', fontSize: 18 }}>Course not found</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#32ADE6', padding: 20 }}>
      <ScrollView contentContainerStyle={{ alignItems: 'center', paddingBottom: 20 }}>
        <Image 
          source={courseImages[course]} 
          style={{
            width: '100%',
            height: 200,
            borderRadius: 10,
            marginBottom: 20,
          }} 
        />
        <Text style={{
          fontSize: 28,
          fontWeight: 'bold',
          color: '#fff',
          marginBottom: 10,
        }}>{course}</Text>
        <Text style={{
          fontSize: 19,
          color: '#fff',
          marginBottom: 10,
        }}>Purpose: {courseDetails[course].purpose}</Text>
        <Text style={{
          fontSize: 19,
          color: '#fff',
          marginBottom: 10,
        }}>Fees: {courseDetails[course].fees}</Text>
        <Text style={{
          fontSize: 19,
          color: '#fff',
          marginBottom: 20,
        }}>Course Content:</Text>
        <View style={{
          backgroundColor: '#fff',
          borderRadius: 10,
          padding: 15,
          marginBottom: 20,
          width: '100%',
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.3,
          shadowRadius: 3.84,
          elevation: 5,
        }}>
          {courseDetails[course].content.map((item, index) => (
            <Text key={index} style={{
              fontSize: 19,
              color: '#333',
              marginBottom: 5,
            }}>• {item}</Text>
          ))}
        </View>
        <TouchableOpacity 
          onPress={handleEnroll}
          style={{
            backgroundColor: isEnrolled ? '#5856D6' : '#5856D6',
            paddingVertical: 12,
            paddingHorizontal: 25,
            borderRadius: 8,
            alignItems: 'center',
            marginBottom: 20,
            elevation: 5,
          }}
        >
          <Text style={{
            color: '#fff',
            fontWeight: 'bold',
            fontSize: 19,
          }}>{isEnrolled ? "unselect" : "select"}</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};



const CalculateFeesScreen = ({ navigation }: { navigation: any }) => {
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);
  const [totalFees, setTotalFees] = useState(0);
  const [originalPrice, setOriginalPrice] = useState(0);
  const [discountedPrice, setDiscountedPrice] = useState(0);
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    const getSelectedCourses = async () => {
      const courses = await AsyncStorage.getItem('selectedCourses');
      const parsedCourses = courses ? JSON.parse(courses) : [];
      setSelectedCourses(parsedCourses);
      calculateFees(parsedCourses);
    };
    getSelectedCourses();
  }, []);

  const calculateFees = (courses: string[]) => {
    const fees = courses.reduce((sum, course) => sum + coursePrices[course], 0);
    setTotalFees(fees);
    setOriginalPrice(fees);
    applyDiscount(courses.length, fees);
  };

  const applyDiscount = (numberOfCourses: number, total: number) => {
    let discount = 0;
    if (numberOfCourses === 1) {
      discount = 0; // No discount for 1 course
    } else if (numberOfCourses === 2) {
      discount = 0.05; // 5% discount for 2 courses
    } else if (numberOfCourses === 3) {
      discount = 0.1; // 10% discount for 3 courses
    } else {
      discount = 0.15; // 15% discount for more than 3 courses
    }
    
    const discountTotal = total - (total * discount);
    setDiscountedPrice(discountTotal);
  };

  const removeCourse = async (courseToRemove: string) => {
    const updatedCourses = selectedCourses.filter(course => course !== courseToRemove);
    setSelectedCourses(updatedCourses);
    await AsyncStorage.setItem('selectedCourses', JSON.stringify(updatedCourses));
    calculateFees(updatedCourses);
  };

  const handleProceedToEnroll = () => {
    Alert.alert(
      "You have successfuly Applied!",
      `You have officially applied for the following courses: ${selectedCourses.join(', ')}\nTotal Fees: ${discountedPrice} Rand`
    );

    // Clear form and selected courses
    clearForm();
    AsyncStorage.removeItem('selectedCourses'); // Clear courses from AsyncStorage
    navigation.navigate('Home');
  };

  const clearForm = () => {
    setSelectedCourses([]);
    setTotalFees(0);
    setOriginalPrice(0);
    setDiscountedPrice(0);
    setName('');
    setSurname('');
    setEmail('');
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#f7f7f7', padding: 20 }}>
      {/* User Information */}
      <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#333', marginBottom: 15 }}>Application Form</Text>
      <TextInput 
        placeholder="Enter Name" 
        value={name} 
        onChangeText={setName}
        style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 5, padding: 10, marginBottom: 10 }} 
      />
      <TextInput 
        placeholder="Enter Surname" 
        value={surname} 
        onChangeText={setSurname}
        style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 5, padding: 10, marginBottom: 10 }} 
      />
      <TextInput 
        placeholder="Enter Email Address" 
        value={email} 
        onChangeText={setEmail}
        style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 5, padding: 10, marginBottom: 15 }} 
      />

      {/* Selected Courses */}
      <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#333', marginBottom: 15 }}>Selected Courses:</Text>
      {selectedCourses.map((course) => (
        <View key={course} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
          <Text style={{ fontSize: 16, color: '#333' }}>{course} - {coursePrices[course]} R</Text>
          <TouchableOpacity 
            style={{ backgroundColor: '#FF6347', paddingVertical: 8, paddingHorizontal: 15, borderRadius: 5 }}
            onPress={() => removeCourse(course)}
          >
            <Text style={{ color: '#fff', fontSize: 16 }}>Remove</Text>
          </TouchableOpacity>
        </View>
      ))}
      
      {/* Price Summary */}
      <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 10 }}>Original Total Fees: {originalPrice} Rand</Text>
      <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 20 }}>Discounted Total Fees: {discountedPrice} Rand</Text>

      {/* Enroll and Clear Buttons */}
      <TouchableOpacity 
        style={{
          backgroundColor: '#0099FF',
          paddingVertical: 12,
          paddingHorizontal: 30,
          borderRadius: 10,
          alignItems: 'center',
          marginBottom: 10,
        }}
        onPress={handleProceedToEnroll}
      >
        <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold' }}>Apply</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={{
          backgroundColor: '#FF6347',
          paddingVertical: 12,
          paddingHorizontal: 30,
          borderRadius: 10,
          alignItems: 'center',
        }}
        onPress={clearForm}
      >
        <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold' }}>Clear</Text>
      </TouchableOpacity>
    </View>
  );
};


// Purchase Screen
const PurchaseScreen = ({ route, navigation }: { route: any, navigation: any }) => {
  const { selectedCourses, totalFees } = route.params; // Destructure courses and fees
  const [paymentMethod, setPaymentMethod] = useState<string>('Card');
  const [cardDetails, setCardDetails] = useState({ cardNumber: '', expiry: '', cvc: '' });

  const handlePayment = () => {
    if (!cardDetails.cardNumber || !cardDetails.expiry || !cardDetails.cvc) {
      Alert.alert('Error', 'Please enter complete card details.');
      return;
    }

    // Simulate a payment process (In real case, integrate a payment gateway)
    Alert.alert('Payment Successful', `You have successfully paid for ${selectedCourses.join(', ')} with ${paymentMethod}. Total: ${totalFees} Rand`);

    // Navigate back to home screen or a success screen after payment
    navigation.navigate('Home');  // Adjust as per your navigation flow
  };

  return (
    <View style={styles.paymentContainer}>
      <Text>Total Fees: {totalFees} Rand</Text> {/* Correctly wrapped in <Text> */}
      <Text>Selected Courses: {selectedCourses.join(', ')}</Text> {/* Correctly wrapped in <Text> */}

      <Text>Select Payment Method:</Text>
      <View style={styles.paymentOptions}>
        <TouchableOpacity onPress={() => setPaymentMethod('Card')}>
          <Text style={styles.paymentText}>Card</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setPaymentMethod('E-Wallet')}>
          <Text style={styles.paymentText}>E-Wallet</Text>
        </TouchableOpacity>
      </View>

      {paymentMethod === 'Card' && (
        <View>
          <TextInput
            placeholder="Card Number"
            keyboardType="numeric"
            onChangeText={(text) => setCardDetails({ ...cardDetails, cardNumber: text })}
            value={cardDetails.cardNumber}
          />
          <TextInput
            placeholder="Expiry (MM/YY)"
            keyboardType="numeric"
            onChangeText={(text) => setCardDetails({ ...cardDetails, expiry: text })}
            value={cardDetails.expiry}
          />
          <TextInput
            placeholder="CVC"
            keyboardType="numeric"
            onChangeText={(text) => setCardDetails({ ...cardDetails, cvc: text })}
            value={cardDetails.cvc}
          />
        </View>
      )}

      <Button title="Pay Now" onPress={handlePayment} />
    </View>
  );
};

const AboutUsScreen = () => (
  <View style={{
    flex: 1,
    backgroundColor: '#32ADE6', // Updated background color
    padding: 20,
    alignItems: 'center',
  }}>
    <Text style={{
      fontSize: 32,
      fontWeight: 'bold',
      color: '#FFFFFF', // Updated text color for better contrast
      marginBottom: 20,
    }}>
      About Us
    </Text>
    <Text style={{
      fontSize: 19,
      color: '#fff', // Updated text color for better contrast
      textAlign: 'center',
      marginBottom: 15,
    }}>
      The SME initiative led by Precious Radebe focuses on providing skills training for domestic workers and gardeners, particularly those who have not had the opportunity to upskill or gain formal education, much like her parents and other elderly relatives. This training helps these individuals become more marketable, secure higher-paying jobs, and even start their own small businesses. Many employers are interested in having their domestic staff receive this training to enhance the range of skilled services they offer.
    </Text>
    <Image
      source={require('./assets/logo.png')} // Adjust the path to the image
      style={{
        width: 245,
        height: 223,
        borderRadius: 15, // Rounded edges
        resizeMode: 'cover',
        marginVertical: 20,
      }}
    />
    <Text style={{
      fontSize: 19,
      color: '#FFFFFF', // Updated text color for better contrast
      textAlign: 'center',
      marginBottom: 15,
    }}>
      Through this initiative, we are dedicated to empowering individuals to reach their full potential. Thank you for learning about our mission.
    </Text>
  </View>
);
const ContactUsScreen = () => (
  <View style={{
    flex: 1,
    backgroundColor: '#32ADE6',
    padding: 20,
    alignItems: 'center',
  }}>
    <Text style={{
      fontSize: 32,
      fontWeight: 'bold',
      color: '#FFFFFF',
      marginBottom: 20,
    }}>
      Contact Us
    </Text>
    <Text style={{
      fontSize: 19,
      color: '#FFFFFF',
      textAlign: 'center',
      marginBottom: 10,
    }}>
      Phone Number:
    </Text>
    <Text style={{
      fontSize: 16,
      color: '#FFFFFF',
      marginBottom: 15,
    }}>
      088 333 777 666
    </Text>
    <Text style={{
      fontSize: 16,
      color: '#FFFFFF',
      textAlign: 'center',
      marginBottom: 10,
    }}>
      Email Address:
    </Text>
    <Text style={{
      fontSize: 16,
      color: '#FFFFFF',
      marginBottom: 15,
    }}>
      Empowering the nation@edu.co.za
    </Text>
    <Text style={{
      fontSize: 18,
      fontWeight: 'bold',
      color: '#FFFFFF',
      marginBottom: 10,
    }}>
      Postal Address
    </Text>
    <Text style={{
      fontSize: 16,
      color: '#FFFFFF',
      marginBottom: 15,
    }}>
      MIDRAND 1682, JOHANNESBURG
    </Text>
    <Image
      source={require('./assets/location.png')}
      style={{
        width: 245,
        height: 223,
        borderRadius: 15,
        resizeMode: 'cover',
        marginTop: 20,
      }}
    />
  </View>
);


const App = () => (
  <NavigationContainer>
    <Stack.Navigator initialRouteName="Splash">
      <Stack.Screen name="Splash" component={SplashScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="SixMonthCourses" component={SixMonthCoursesScreen} />
      <Stack.Screen name="SixWeekCourses" component={SixWeekCoursesScreen} />
      <Stack.Screen name="CourseDetails" component={CourseDetailsScreen} />
      <Stack.Screen name="CalculateFees" component={CalculateFeesScreen} />
      <Stack.Screen name="Purchase" component={PurchaseScreen} />
      <Stack.Screen name="AboutUs" component={AboutUsScreen} />
      <Stack.Screen name="ContactUs" component={ContactUsScreen} />
    </Stack.Navigator>
  </NavigationContainer>
);

const styles = StyleSheet.create({
  splashScreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f4f8', // Light background color for splash screen
  },
  formContainer: {
    padding: 20,
    justifyContent: 'center',
    flex: 1,
    backgroundColor: '#ffffff', // White background for form
    borderRadius: 10,
    shadowColor: '#000', // Adding shadow for elevation
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  profileImageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  profileImagePlaceholder: {
    backgroundColor: 'lightgrey',
    padding: 10,
    borderRadius: 50,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: '#ccc', // Lighter border color
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
    borderRadius: 5, // Rounded corners for inputs
  },
  error: {
    color: 'red',
  },
  loginText: {
    marginTop: 15,
    color: '#007BFF', // Bootstrap primary blue
    textAlign: 'center',
  },
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  courseContainer: {
    padding: 20,
    backgroundColor: '#f9f9f9', // Light grey background for course container
    borderRadius: 10,
  },
  courseTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  card: {
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ccc', // Light border color for cards
    borderRadius: 5,
    alignItems: 'center',
    backgroundColor: '#fff', // White background for cards
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  courseImage: {
    width: 100,
    height: 100,
    borderRadius: 5, // Rounded corners for course images
  },
  courseDetailContainer: {
    padding: 20,
    alignItems: 'center',
  },
  detailImage: {
    width: 150,
    height: 150,
    marginBottom: 10,
    borderRadius: 5, // Rounded corners for detail images
  },
  courseDetailTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  courseDetailText: {
    textAlign: 'center',
    marginBottom: 20,
  },
  feesContainer: {
    padding: 20,
    alignItems: 'center',
  },
  paymentContainer: {
    padding: 20,
    alignItems: 'center',
  },
  paymentOptions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  paymentText: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc', // Light border color for payment options
    borderRadius: 5,
    backgroundColor: '#e9ecef', // Light background for payment options
  },
  aboutContainer: {
    padding: 20,
    alignItems: 'center',
  },
  aboutText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#4CAF50', // Button color
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    width: '100%', // Full-width buttons
    marginBottom: 10, // Spacing between buttons
  },
  buttonText: {
    color: '#fff', // White text for buttons
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default App;
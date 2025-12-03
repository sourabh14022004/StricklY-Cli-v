import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  ScrollView,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import styles from '../styles/WelcomeScreenStyles';

const { width, height } = Dimensions.get('window');

interface Slide {
  id: number;
  title: string;
  type: 'todos' | 'calendar' | 'projects';
}

interface NavigationProps {
  navigation: {
    navigate: (screen: string) => void;
  };
}

export default function WelcomeScreen({ navigation }: NavigationProps) {
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const autoSlideTimer = useRef<NodeJS.Timeout | null>(null);
  const isUserScrolling = useRef<boolean>(false);

  const slides: Slide[] = [
    {
      id: 0,
      title: 'Todos',
      type: 'todos',
    },
    {
      id: 1,
      title: 'Calendar',
      type: 'calendar',
    },
    {
      id: 2,
      title: 'Projects',
      type: 'projects',
    },
  ];

  useEffect(() => {
    // Auto-slide functionality
    autoSlideTimer.current = setInterval(() => {
      if (!isUserScrolling.current) {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }
    }, 3000);

    return () => {
      if (autoSlideTimer.current) {
        clearInterval(autoSlideTimer.current);
      }
    };
  }, []);

  useEffect(() => {
    // Scroll to current slide
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({
        x: currentSlide * width,
        animated: true,
      });
    }
  }, [currentSlide]);

  const handleScrollBeginDrag = () => {
    isUserScrolling.current = true;
  };

  const handleScrollEndDrag = () => {
    // Reset the flag after a delay to allow auto-scroll to resume
    setTimeout(() => {
      isUserScrolling.current = false;
    }, 2000); // Resume auto-scroll after 2 seconds of no user interaction
  };

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const slideSize = event.nativeEvent.layoutMeasurement.width;
    const index = event.nativeEvent.contentOffset.x / slideSize;
    const roundIndex = Math.round(index);
    
    if (roundIndex !== currentSlide) {
      setCurrentSlide(roundIndex);
    }
  };

  const handlePaginationPress = (index: number) => {
    setCurrentSlide(index);
  };

  const handleGetStarted = () => {
    if (navigation && navigation.navigate) {
      navigation.navigate('login');
    } else {
      console.log('Get Started pressed');
    }
  };

  const renderWidget = (slide: Slide) => {
    switch (slide.type) {
        case 'todos':
          return (
            <View style={styles.widgetCard}>
              <View style={styles.widgetHeader}>
                <Text style={styles.widgetTitle}>Todos</Text>
              </View>
              <View style={styles.todosContent}>
                <View style={styles.todoItem}>
                  <View style={styles.todoCheckbox}>
                    <View style={styles.todoCheckmark} />
                  </View>
                  <View style={styles.todoText}>
                    <View style={styles.todoLineLong} />
                    <View style={styles.todoLineMedium} />
                  </View>
                </View>
                <View style={styles.todoItem}>
                  <View style={styles.todoCheckbox}>
                    <View style={styles.todoCheckmark} />
                  </View>
                  <View style={styles.todoText}>
                    <View style={styles.todoLineMedium} />
                    <View style={styles.todoLineShort} />
                  </View>
                </View>
                <View style={styles.todoItem}>
                  <View style={styles.todoCheckbox}>
                    <View style={styles.todoCheckmark} />
                  </View>
                  <View style={styles.todoText}>
                    <View style={styles.todoLineLong} />
                    <View style={styles.todoLineShort} />
                  </View>
                </View>
              </View>
            </View>
          );
      
      case 'calendar':
        const today = new Date();
        const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
        const dayOfMonth = today.getDate();
        const dayNames = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
        
        return (
          <View style={styles.widgetCard}>
            <View style={styles.calendarHeader}>
              <Text style={styles.widgetTitle}>Calendar</Text>
            </View>
            <View style={styles.calendarContent}>
              <Text style={styles.calendarDate}>{dayOfMonth}</Text>
              <View style={styles.daysRow}>
                {dayNames.map((day, index) => (
                  <View 
                    key={index} 
                    style={[
                      styles.dayPill, 
                      index === dayOfWeek ? styles.dayPillActive : styles.dayPillInactive
                    ]}
                  >
                    <Text style={index === dayOfWeek ? styles.dayTextActive : styles.dayText}>
                      {day}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        );
      
      case 'projects':
        return (
          <View style={styles.widgetCard}>
            <View style={styles.widgetHeader}>
              <Text style={styles.widgetTitle}>Projects</Text>
            </View>
            <View style={styles.projectsContent}>
              <View style={styles.projectItem}>
                <View style={styles.projectIcon} />
                <View style={styles.projectText}>
                  <View style={styles.projectLineShortDark} />
                  <View style={styles.projectLineLong} />
                  <View style={styles.projectLineLong} />
                </View>
                <View style={styles.projectLineShortLight} />
              </View>
              <View style={styles.projectItem}>
                <View style={styles.projectIcon} />
                <View style={styles.projectText}>
                  <View style={styles.projectLineMediumDark} />
                  <View style={styles.projectLineLong} />
                  <View style={styles.projectLineLong} />
                </View>
                <View style={styles.projectLineShortLight} />
              </View>
              <View style={styles.projectItem}>
                <View style={styles.projectIcon} />
                <View style={styles.projectText}>
                  <View style={styles.projectLineShortDark} />
                  <View style={styles.projectLineShortDark} />
                  <View style={styles.projectLineLong} />
                  <View style={styles.projectLineLong} />
                </View>
                <View style={styles.projectLineShortLight} />
              </View>
            </View>
          </View>
        );
      
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      
      {/* Background decorative elements */}
      <View style={styles.backgroundElements}>
        <View style={styles.circle1} />
        <View style={styles.circle2} />
        <View style={styles.circle3} />
        <View style={styles.rectangle1} />
        <View style={styles.rectangle2} />
      </View>
      
      {/* Full screen content */}
      <View style={styles.screenContent}>
        {/* App logo */}
        <View style={styles.logoContainer}>
          <View style={styles.logoSquare}>
            <Text style={styles.logoText}>S</Text>
          </View>
        </View>
        
        {/* Central productivity widget slideshow */}
        <View style={styles.widgetContainer}>
          <ScrollView
            ref={scrollViewRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScrollBeginDrag={handleScrollBeginDrag}
            onScrollEndDrag={handleScrollEndDrag}
            onMomentumScrollEnd={handleScroll}
            style={styles.scrollView}
          >
            {slides.map((slide) => (
              <View key={slide.id} style={styles.slideContainer}>
                {renderWidget(slide)}
              </View>
            ))}
          </ScrollView>
        </View>
        
        {/* Welcome message */}
        <Text style={styles.welcomeText}>
          <Text style={styles.welcomeLine1}>Welcome to</Text>
          <Text style={styles.welcomeLine2}>Strickly</Text>
        </Text>
        
        {/* Tagline */}
        <Text style={styles.tagline}>
          Optimize your day and manage tasks efficiently.
        </Text>
        
        {/* Get Started button */}
        <TouchableOpacity style={styles.getStartedButton} onPress={handleGetStarted}>
          <Text style={styles.getStartedText}>Get Started</Text>
        </TouchableOpacity>
        
        {/* Pagination indicators */}
        <View style={styles.paginationContainer}>
          {slides.map((_, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.paginationDot,
                currentSlide === index && styles.paginationDotActive
              ]}
              onPress={() => handlePaginationPress(index)}
            />
          ))}
        </View>
      </View>
    </View>
  );
}


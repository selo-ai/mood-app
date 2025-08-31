import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { ChevronLeft, ChevronRight } from 'react-native-feather';
import { TEXT_STYLES, COLORS, SPACING, BORDER_RADIUS } from '../constants/typography';

const { width: screenWidth } = Dimensions.get('window');

interface ChartData {
  date: string;
  value: number;
}

interface DateChartViewProps {
  title: string;
  data: ChartData[];
  maxValue?: number;
  color?: string;
  onDateChange?: (date: string) => void;
}

const DateChartView: React.FC<DateChartViewProps> = ({
  title,
  data,
  maxValue,
  color = COLORS.primary[500],
  onDateChange,
}) => {
  const [selectedDateIndex, setSelectedDateIndex] = useState(data.length - 1);

  const chartMaxValue = maxValue || Math.max(...data.map(d => d.value), 100);
  const selectedDate = data[selectedDateIndex];

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        console.warn('Invalid date string:', dateString);
        return '01/01';
      }
      return date.toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit' });
    } catch (error) {
      console.warn('Date formatting error:', error);
      return '01/01';
    }
  };

  const formatFullDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        console.warn('Invalid date string:', dateString);
        return 'Pazartesi, 1 Ocak';
      }
      return date.toLocaleDateString('tr-TR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
      });
    } catch (error) {
      console.warn('Full date formatting error:', error);
      return 'Pazartesi, 1 Ocak';
    }
  };

  const getRelativeDateLabel = (dateString: string, index: number) => {
    try {
      const today = new Date();
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        console.warn('Invalid date string in relative label:', dateString);
        return 'Bugün';
      }
      const diffTime = Math.abs(today.getTime() - date.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

          if (diffDays === 0) return 'Bugün';
      if (diffDays === 1) return 'Dün';
      return formatDate(dateString);
    } catch (error) {
      console.warn('Relative date label error:', error);
      return 'Bugün';
    }
  };

  const handlePreviousDate = () => {
    if (selectedDateIndex > 0) {
      const newIndex = selectedDateIndex - 1;
      setSelectedDateIndex(newIndex);
      onDateChange?.(data[newIndex].date);
    }
  };

  const handleNextDate = () => {
    if (selectedDateIndex < data.length - 1) {
      const newIndex = selectedDateIndex + 1;
      setSelectedDateIndex(newIndex);
      onDateChange?.(data[newIndex].date);
    }
  };

  return (
    <View style={styles.container}>
      {/* Date Selector Card */}
      <View style={styles.dateSelectorCard}>
        <TouchableOpacity
          style={styles.dateNavButton}
          onPress={handlePreviousDate}
          disabled={selectedDateIndex === 0}
        >
          <ChevronLeft 
            width={24} 
            height={24} 
            color={selectedDateIndex === 0 ? COLORS.neutral[400] : COLORS.text.primary} 
          />
        </TouchableOpacity>

        <View style={styles.dateDisplay}>
          <Text style={[styles.currentDate, TEXT_STYLES.h2]}>
            {formatDate(selectedDate.date)}
          </Text>
          <Text style={[styles.fullDate, TEXT_STYLES.body]}>
            {formatFullDate(selectedDate.date)}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.dateNavButton}
          onPress={handleNextDate}
          disabled={selectedDateIndex === data.length - 1}
        >
          <ChevronRight 
            width={24} 
            height={24} 
            color={selectedDateIndex === data.length - 1 ? COLORS.neutral[400] : COLORS.text.primary} 
          />
        </TouchableOpacity>
      </View>

      

      {/* Chart Card */}
      <View style={styles.chartCard}>
        <Text style={[styles.chartTitle, TEXT_STYLES.h3]}>{title}</Text>
        
        <View style={styles.chartContainer}>
          {/* Y-Axis Labels */}
          <View style={styles.yAxis}>
            <Text style={[styles.yAxisLabel, TEXT_STYLES.caption]}>100%</Text>
            <Text style={[styles.yAxisLabel, TEXT_STYLES.caption]}>50%</Text>
            <Text style={[styles.yAxisLabel, TEXT_STYLES.caption]}>0%</Text>
          </View>

          {/* Chart Area */}
          <View style={styles.chartArea}>
            {/* Grid Lines */}
            <View style={styles.gridLines}>
              <View style={styles.gridLine} />
              <View style={styles.gridLine} />
              <View style={styles.gridLine} />
            </View>

            {/* Bars */}
            <View style={styles.barsContainer}>
              {data.map((item, index) => {
                const height = chartMaxValue > 0 ? (item.value / chartMaxValue) * 120 : 0;
                const isSelected = index === selectedDateIndex;
                
                return (
                  <View key={item.date} style={styles.barContainer}>
                    <View
                      style={[
                        styles.bar,
                        {
                          height: Math.max(height, 2),
                          backgroundColor: isSelected ? color : color + '80',
                        },
                      ]}
                    />
                    <Text style={[styles.xAxisLabel, TEXT_STYLES.caption]}>
                      {getRelativeDateLabel(item.date, index)}
                    </Text>
                  </View>
                );
              })}
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: SPACING.md,
  },
  dateSelectorCard: {
    backgroundColor: COLORS.background.card,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: COLORS.shadow.medium,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 4,
  },
  dateNavButton: {
    padding: SPACING.sm,
  },
  dateDisplay: {
    alignItems: 'center',
    flex: 1,
  },
  currentDate: {
    color: COLORS.text.primary,
    marginBottom: SPACING.xs,
    fontSize: 16,
  },
  fullDate: {
    color: COLORS.text.primary,
    textTransform: 'capitalize',
    fontSize: 12,
  },

  chartCard: {
    backgroundColor: COLORS.neutral[100],
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
    shadowColor: COLORS.shadow.medium,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 4,
  },
  chartTitle: {
    color: COLORS.text.primary,
    marginBottom: SPACING.lg,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '600',
  },
  chartContainer: {
    flexDirection: 'row',
    height: 160,
  },
  yAxis: {
    width: 40,
    justifyContent: 'space-between',
    paddingVertical: SPACING.sm,
  },
  yAxisLabel: {
    color: COLORS.text.secondary,
    textAlign: 'right',
    fontSize: 10,
  },
  chartArea: {
    flex: 1,
    position: 'relative',
  },
  gridLines: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'space-between',
  },
  gridLine: {
    height: 1,
    backgroundColor: COLORS.neutral[300],
    width: '100%',
  },
  barsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: '100%',
    paddingBottom: SPACING.lg,
  },
  barContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  bar: {
    width: '80%',
    borderRadius: BORDER_RADIUS.xs,
    minHeight: 2,
  },
  xAxisLabel: {
    color: COLORS.text.secondary,
    marginTop: SPACING.xs,
    textAlign: 'center',
    fontSize: 8,
  },
});

export default DateChartView;

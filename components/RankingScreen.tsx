import { Award, Trophy } from 'lucide-react-native';
import React from 'react';
import { FlatList, Image, StyleSheet, Text, View } from 'react-native';
import { UserProfile } from './data/types';

interface RankingScreenProps {
  users: UserProfile[];
}

const PodiumItem = ({ user, position }: { user: UserProfile, position: number }) => {
    const isFirst = position === 1;
    const isSecond = position === 2;
    const isThird = position === 3;

    const positionStyle = [styles.podiumItem, isSecond && styles.secondPlace, isFirst && styles.firstPlace, isThird && styles.thirdPlace];
    const positionTextStyle = [styles.positionText, isFirst && { color: '#FFD700' }];

    return (
        <View style={positionStyle}>
            <Text style={positionTextStyle}>{position}</Text>
            <Image source={{ uri: user.avatar }} style={styles.avatar} />
            <Text style={styles.name}>{user.name}</Text>
            <Text style={styles.company}>{user.company}</Text>
            <View style={styles.xpContainer}>
                <Award size={16} color="#eab308" />
                <Text style={styles.xpText}>{user.experiencePoints} XP</Text>
            </View>
        </View>
    )
}

export const RankingScreen = ({ users }: RankingScreenProps) => {
  const topThree = users.slice(0, 3);
  const restOfUsers = users.slice(3);

  return (
    <>
      <View style={styles.header}>
        <Trophy size={24} color="#f5d142" />
        <Text style={styles.headerTitle}>Ranking da Comunidade</Text>
      </View>
      <FlatList
        data={restOfUsers}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <View style={styles.podiumContainer}>
            {topThree[1] && <PodiumItem user={topThree[1]} position={2} />}
            {topThree[0] && <PodiumItem user={topThree[0]} position={1} />}
            {topThree[2] && <PodiumItem user={topThree[2]} position={3} />}
          </View>
        }
        renderItem={({ item, index }) => (
          <View style={styles.listItem}>
            <Text style={styles.listPosition}>{index + 4}</Text>
            <Image source={{ uri: item.avatar }} style={styles.listAvatar} />
            <View style={styles.listTextContainer}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.company}>{item.company}</Text>
            </View>
            <Text style={styles.xpText}>{item.experiencePoints} XP</Text>
          </View>
        )}
        contentContainerStyle={styles.listContainer}
      />
    </>
  );
};

const styles = StyleSheet.create({
    header: { padding: 16, borderBottomWidth: 1, borderBottomColor: '#2d325a', backgroundColor: '#1e223b', flexDirection: 'row', alignItems: 'center', gap: 12 },
    headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#f5d142' },
    podiumContainer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'flex-end', padding: 24, paddingBottom: 32 },
    podiumItem: { backgroundColor: '#232842', borderRadius: 12, padding: 16, alignItems: 'center', borderWidth: 1, borderColor: '#2d325a' },
    firstPlace: { height: 240, backgroundColor: '#2a2f4c', borderColor: '#eab308', borderWidth: 2 },
    secondPlace: { height: 220, marginRight: 8 },
    thirdPlace: { height: 220, marginLeft: 8 },
    positionText: { fontSize: 24, fontWeight: 'bold', color: '#a1a1aa', marginBottom: 8 },
    avatar: { width: 80, height: 80, borderRadius: 40, borderWidth: 2, borderColor: 'rgba(234, 179, 8, 0.4)', marginBottom: 8 },
    name: { color: '#f0e6d2', fontWeight: 'bold', fontSize: 14, textAlign: 'center' },
    company: { color: '#a1a1aa', fontSize: 12, textAlign: 'center', marginTop: 2 },
    xpContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 8, backgroundColor: 'rgba(234, 179, 8, 0.1)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
    xpText: { color: '#eab308', fontWeight: 'bold', fontSize: 12, marginLeft: 4 },
    listContainer: { paddingHorizontal: 16, paddingBottom: 90 },
    listItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#232842', padding: 12, borderRadius: 8, marginBottom: 8 },
    listPosition: { color: '#a1a1aa', fontWeight: 'bold', fontSize: 16, width: 30 },
    listAvatar: { width: 40, height: 40, borderRadius: 20, marginRight: 12 },
    listTextContainer: { flex: 1 },
});
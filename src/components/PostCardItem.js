import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'
import { Card } from 'react-native-paper';
import { Feather } from '@expo/vector-icons';

const Button = ({ onPress, style, icon }) => (
  <TouchableOpacity style={style} onPress={onPress}>
    <Feather name={icon} size={24} />
  </TouchableOpacity>
)

export default function PostCardItem({ title, author, onEdit, onDelete }) {
console.log(title)
  return (
    <Card style={styles.item}>
      <View style={styles.rowView}>
        <View>
          <Text style={styles.title}>{title}</Text>
          <Text>Author: {author}</Text>
        </View>
        <View style={styles.rowView}>
          <Button
            onPress={onEdit}
            icon="edit"
            style={{ marginHorizontal: 16 }} />
          <Button onPress={onDelete} icon='trash-2' />
        </View>
      </View>
    </Card>
  )
}

const styles = StyleSheet.create({
  rowView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  item: {
    padding: 16,
    margin: 16,
    elevation: 4,
    borderRadius: 8
  },
  title: {
    fontSize: 18,
  },
})
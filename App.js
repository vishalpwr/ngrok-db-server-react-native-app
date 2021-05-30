import { StatusBar, } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Card, Surface, Title, TextInput } from 'react-native-paper';
import { AntDesign } from '@expo/vector-icons';
import ModalView from './src/components/ModalView';

const url = 'https://ae06fec9c1a7.ngrok.io/posts'

export default function App() {
  const [data, setData] = useState([]);
  const [visible, setVisible] = useState(false);
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [postId, setPostId] = useState(0);
  const [loading, setLoading] = useState(false);

  const getPosts = async () => {
    setLoading(true)
    await fetch(url)
      .then((res) => res.json())
      .then(resJson => {
        // console.log('data', resJson)
        setData(resJson);
      }).catch(e => { console.log(e) })
    setLoading(false)
  }

  const addPost = (title, author) => {
    fetch(url, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        "author": author,
        "title": title,
      })
    }).then((res) => res.json())
      .then(resJson => {
        console.log('post:', resJson)
        getPosts()
        setVisible(false);
        setAuthor('')
        setTitle('')
      }).catch(e => { console.log(e) })
  }

  const editPost = (postId, title, author) => {
    fetch(url + `/${postId}`, {
      method: "PUT",
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        "author": author,
        "title": title,
      })
    }).then((res) => res.json())
      .then(resJson => {
        console.log('post:', resJson)
        getPosts()
        setVisible(false);
        setAuthor('')
        setTitle('')
        setPostId(0)
      }).catch(e => { console.log(e) })
  }

  const deletePost = (postId) => {
    fetch(url + `/${postId}`, {
      method: "DELETE",
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      }
    }).then((res) => res.json())
      .then(resJson => {
        console.log('delete:', resJson)
        getPosts()
      }).catch(e => { console.log(e) })
  }

  const edit = (id, title, author) => {
    setVisible(true)
    setPostId(id)
    setTitle(title)
    setAuthor(author)
  }

  useEffect(() => {
    getPosts();
  }, [])

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="steelblue" />
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Surface style={{ marginTop: 24, padding: 16, elevation: 2, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Title>Posts</Title>
        <TouchableOpacity onPress={() => setVisible(true)}>
          <Text style={{ padding: 10, borderRadius: 20, backgroundColor: 'steelblue', color: 'white' }}>Add Post</Text>
        </TouchableOpacity>
      </Surface>
      <FlatList
        data={data}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => {
          return (
            <Card style={{ padding: 16, margin: 16, elevation: 4, borderRadius: 8 }}>
              <View style={styles.rowView}>
                <View>
                  <Text style={{ fontSize: 18 }}>{item.title}</Text>
                  <Text>Author: {item.author}</Text>
                </View>
                <View style={styles.rowView}>
                  <TouchableOpacity style={{ marginHorizontal: 16 }}
                    onPress={() => edit(item.id, item.title, item.author)}>
                    <AntDesign name="edit" size={24} />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => deletePost(item.id)}>
                    <AntDesign name="delete" size={24} />
                  </TouchableOpacity>
                </View>
              </View>
            </Card>
          )
        }}
      />
      <ModalView
        visible={visible}
        title="Add Post"
        onDismiss={() => setVisible(false)}
        onSubmit={() => {
          if (postId && title && author) {
            editPost(postId, title, author)
          } else {
            addPost(title, author)
          }
        }}
        cancelable
      >
        <TextInput
          label="Title"
          value={title}
          onChangeText={(text) => setTitle(text)}
          mode="outlined"
        />
        <TextInput
          label="Author"
          value={author}
          onChangeText={(text) => setAuthor(text)}
          mode="outlined"
        />
      </ModalView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  rowView: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  }
});

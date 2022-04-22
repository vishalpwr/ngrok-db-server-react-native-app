import { StatusBar, } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View, TouchableOpacity, ActivityIndicator, SafeAreaView, Platform } from 'react-native';
import { Surface, Title, TextInput } from 'react-native-paper';
import ModalView from './src/components/ModalView';
import PostCardItem from './src/components/PostCardItem';

// update this url -> "<new_ngrok_host_url>/posts"
const url = 'https://5a88-2409-4043-4e81-648d-a145-18e8-b2af-fdae.ngrok.io/posts'

const headers = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
};

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
      .then((res) => {
        setData(res);
      })
      .catch(e => console.log(e))
    setLoading(false)
  }

  const addPost = (title, author) => {
    fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify({
        "author": author,
        "title": title,
      })
    }).then((res) => res.json())
      .then(resJson => {
        console.log('post:', resJson)
        updatePost()
      }).catch(e => { console.log(e) })
  }

  const editPost = (postId, title, author) => {
    fetch(url + `/${postId}`, {
      method: "PUT",
      headers,
      body: JSON.stringify({
        "author": author,
        "title": title,
      })
    }).then((res) => res.json())
      .then(resJson => {
        console.log('updated:', resJson)
        updatePost()
      }).catch(e => { console.log(e) })
  }

  const deletePost = (postId) => {
    fetch(url + `/${postId}`, {
      method: "DELETE",
      headers,
    }).then((res) => res.json())
      .then(resJson => {
        console.log('delete:', resJson)
        getPosts()
      }).catch(e => { console.log(e) })
  }

  const updatePost = () => {
    getPosts()
    setVisible(false);
    setAuthor('')
    setTitle('')
    setPostId(0)
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

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      <Surface style={styles.header}>
        <Title>Posts</Title>
        <TouchableOpacity style={styles.button} onPress={() => setVisible(true)}>
          <Text style={styles.buttonText}>Add Post</Text>
        </TouchableOpacity>
      </Surface>
      <FlatList
        data={data}
        keyExtractor={(item, index) => item.id + index.toString()}
        refreshing={loading}
        onRefresh={getPosts}
        renderItem={({ item }) => (
          <PostCardItem
            title={item.title}
            author={item.author}
            onEdit={() => edit(item.id, item.title, item.author)}
            onDelete={() => deletePost(item.id)}
          />
        )}
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  header: {
    marginTop: Platform.OS === 'android' ? 24 : 0,
    padding: 16,
    elevation: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  button: {
    padding: 10,
    borderRadius: 20,
    backgroundColor: 'steelblue',
  },
  buttonText: {
    color: 'white'
  },
});

import { useState, useEffect } from 'react';
import { Box, Heading, Button, Input, Textarea, FormControl, FormLabel, Select, Alert, AlertIcon, AlertTitle, AlertDescription } from '@chakra-ui/react';
import { v4 as uuidv4 } from 'uuid';
import { firestore, storage } from './firebase';

function NewsEditor() {
  const [news, setNews] = useState([]);
  const [title, setTitle] = useState('');
  const [mainImage, setMainImage] = useState(null);
  const [category, setCategory] = useState('all');
  const [writer, setWriter] = useState('');
  const [date, setDate] = useState('');
  const [contents, setContents] = useState('');
  const [error, setError] = useState('');

  const addNews = async () => {
    try {
      const id = uuidv4(); // unique한 id 생성
      const imageName = mainImage.name;

      // 이미지 크기 체크
      if(mainImage.size > 10000000) {
        setError('이미지 용량이 너무 큽니다. 10MB 이하의 이미지를 업로드해주세요.');
        return;
      }

      // storage에 파일 업로드하기 - gs://dusmedia-e4bb8.appspot.com
      const metadata = { customMetadata: { id } };
      const imageRef = storage.ref(`images/${id}/${imageName}`);
      await imageRef.put(mainImage, metadata);

      // storage의 저장된 이미지 URL 추출하기
      const imageURL = await imageRef.getDownloadURL();

      // createdAt을 추가해 데이터 정렬
      const createdAt = new Date().getTime();

      // firestore에 뉴스 데이터 작성하기
      const newNews = {
        id,
        title,
        mainImage: imageURL,
        category: category === "" ? 'all' : category,
        writer,
        date,
        contents,
        createdAt,
      };
      await firestore.collection('news').doc(id).set(newNews);

      // 뉴스 데이터 업데이트하고 폼 초기화하기
      setNews([...news, newNews]);
      setTitle('');
      setMainImage(null);
      setCategory('');
      setWriter('');
      setDate('');
      setContents('');
      setError('');
    } catch (error) {
      console.error(error);
      setError('뉴스 기사를 추가하는 도중 에러가 발생했습니다. 다시 시도해주세요.');
    }
  };

  const updateNews = async (id, updatedNews) => {
    try {
      await firestore.collection('news').doc(id).set(updatedNews);
      const index = news.findIndex((news) => news.id === id);
      setNews([...news.slice(0, index), updatedNews, ...news.slice(index + 1)]);
      setTitle('');
      setMainImage(null);
      setCategory('');
      setWriter('');
      setDate('');
      setContents('');
      setError('');
    } catch (error) {
      console.error(error);
      setError('뉴스 기사를 수정하는 도중 에러가 발생했습니다. 다시 시도해주세요.');
    }
  };

  const deleteNews = async (id) => {
    try {
      await firestore.collection('news').doc(id).delete();
      const index = news.findIndex((news) => news.id === id);
      const updatedNews = [...news.slice(0, index), ...news.slice(index + 1)];
      setNews(updatedNews);
    } catch (error) {
      console.error(error);
      setError('뉴스 기사를 삭제하는 도중 에러가 발생했습니다. 다시 시도해주세요.');
    }
  };

  const handleMainImageChange = (e) => {
    if (e.target.files[0]) {
      setMainImage(e.target.files[0]);
    }
  };

  useEffect(() => {
    const unsubscribe = firestore.collection('news').onSnapshot((snapshot) => {
      const data = [];
      snapshot.forEach((doc) => {
        data.push(doc.data());
      });
      setNews(data);
    });
    return unsubscribe;
  }, []);

  return (
    <Box maxW="600px" mx="auto" my="4">
      <Heading my="4">뉴스 편집기</Heading>
      <FormControl isRequired>
        <FormLabel>뉴스 제목</FormLabel>
        <Input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
      </FormControl>
      <FormControl my="4">
        <FormLabel>메인 이미지</FormLabel>
        <Input type="file" onChange={handleMainImageChange} accept="image/*" />
      </FormControl>
      <FormControl isRequired my="4">
        <FormLabel>카테고리</FormLabel>
        <Select value={category} onChange={(e) => setCategory(e.target.value)}>
          <optiin value="all" disabled>전체</optiin>
          <option value="coin">암호화폐</option>
          <option value="stock">주식</option>
          <option value="overseas">해외증시</option>
          <option value="rate">환율금리</option>
        </Select>
      </FormControl>
      <FormControl isRequired my="4">
        <FormLabel>작성자</FormLabel>
        <Input type="text" value={writer} onChange={(e) => setWriter(e.target.value)} />
      </FormControl>
      <FormControl isRequired my="4">
        <FormLabel>작성일</FormLabel>
        <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      </FormControl>
      <FormControl isRequired my="4">
        <FormLabel>뉴스 내용</FormLabel>
        <Textarea value={contents} height="600px" onChange={(e) => setContents(e.target.value)} />
      </FormControl>
      {error && (
        <Alert status="error" my="4">
          <AlertIcon />
          <AlertTitle mr={2}>에러 발생!</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <Button colorScheme="blue" my="4" onClick={addNews}>
        추가
      </Button>
      <Box textAlign="center" fontSize="18px" fontWeight="bold">
        {news.map((news) => (
          <Box key={news.id} borderBottom="1px solid #ccc" py="4">
            <Box fontWeight="normal">{news.date}</Box>
            <Box as="h2" fontSize="20px" mt="2">
              {news.title}
            </Box>
            <Box as="img" w="100%" src={news.mainImage} mt="4" />
            <Box fontWeight="normal" fontStyle="italic" my="2">
              {news.category}
            </Box>
            <Box>{news.writer}</Box>
            <Box mt="2" whiteSpace="pre-wrap">
              {news.contents}
            </Box>
            <Button colorScheme="blue" my="2" size="sm" onClick={() => deleteNews(news.id)}>
              삭제
            </Button>
            <Button
              colorScheme="blue"
              my="2"
              ml="2"
              size="sm"
              onClick={() =>
                updateNews(news.id, {
                  ...news,
                  contents: `${news.contents}\n\n[오늘의 뉴스]`,
                })
              }
            >
              수정
            </Button>
          </Box>
        ))}
      </Box>
    </Box>
  );
}

export default NewsEditor;



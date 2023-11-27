import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Table, InputGroup, Form, Row, Col, Button, Spinner } from 'react-bootstrap';

const SearchPage = () => {
    const [loading, setLoading] = useState(false);
    const [list, setList] = useState([]);
    const [query, setQuery] = useState("맥북");
    const [page, setPage] = useState(1);
    const [cnt, setCnt] = useState(0);

    const getList = async () => {
        setLoading(true);
        const res = await axios(`/search/list.json?page=${page}&size=5&query=${query}`);
        //console.log(res.data);
        let data = res.data.items.map(s => s && { ...s, title: stripHtmlTags(s.title) });
        data = data.map(item => item && { ...item, checked: false });
        setList(data);
        setLoading(false);
    }

    useEffect(() => {
        getList();
    }, [page]);

    const onSubmit = (e) => {
        e.preventDefault();
        if (query === "") {
            alert("검색어를 입력해주세요");
        } else {
            getList();
        }
    }

    const onSave = async (shop) => {
        if (window.confirm("상품을 등록하시겠습니까?")) {
            await axios.post("/shop/insert", shop);
            alert("상품등록완료");
        }
    }

    // HTML 태그를 제거하는 함수
    const stripHtmlTags = (htmlString) => {
        const doc = new DOMParser().parseFromString(htmlString, 'text/html');
        return doc.body.textContent || "";
    }

    //체크박스 전체 선택 함수
    const onChangeAll = (e) => {
        //console.log(e.target.checked);
        const data = list.map(item => item && { ...item, checked: e.target.checked });
        setList(data);
    }

    //체크박스 하나씩 선택
    const onChageSingle = (e, pid) => {
        const data = list.map(item => item.productId === pid ? { ...item, checked: e.target.checked } : item);
        setList(data);
    }

    //전체 체크박스 눌러져 있을때 하나 취소하면 전체선택 체크박스 해제 함수
    useEffect(() => {
        let chk = 0;
        list.forEach(item => {
            if (item.checked) chk++;
        });
        //console.log(chk);
        setCnt(chk);
    }, [list]);

    const onCheckedSave = async () => {
        if(cnt===0) {
            alert("저장할 상품을 선택해 주세요");
        }else {
            //선택저장
            if(window.confirm(`${cnt}개 상품을 등록하시겠습니까?`)) {
                for(const item of list) {
                    if(item.checked) {
                       await axios.post("/shop/insert", item);
                    }
                }
                alert("등록이 완료되었습니다.");
                getList();
            }
        }
    }

    if (loading) return <div className='text-center my-3'><Spinner /></div>

    return (
        <div className='my-5'>
            <h1 className='text-center mb-5'>상품검색</h1>
            <Row className='mb-2'>
                <Col md={4}>
                    <form onSubmit={onSubmit}>
                        <InputGroup>
                            <Form.Control onChange={(e) => setQuery(e.target.value)}
                                placeholder='상품명, 제조사' value={query} />
                            <Button type='submit'>검색</Button>
                        </InputGroup>
                    </form>
                </Col>
                <Col className='text-end'>
                    <Button onClick={onCheckedSave}>선택 저장</Button>
                </Col>
            </Row>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <td><input type='checkbox' onChange={onChangeAll} checked={list.length === cnt} /></td>
                        <td>ID</td><td>이미지</td><td>제목</td>
                        <td>가격</td><td>제조사</td><td>상품등록</td>
                    </tr>
                </thead>
                <tbody>
                    {list.map(s =>
                        <tr key={s.productId}>
                            <td><input onChange={(e) => onChageSingle(e, s.productId)}
                                type='checkbox' checked={s.checked} /></td>
                            <td>{s.productId}</td>
                            <td><img src={s.image} width="50" /></td>
                            <td><div className='ellipsis'>{s.title}</div></td>
                            <td>{s.lprice}</td>
                            <td>{s.maker}</td>
                            <td><Button onClick={() => onSave(s)}
                                className='btn-sm'>등록</Button></td>
                        </tr>
                    )}
                </tbody>
            </Table>
            <div className='text-center'>
                <Button onClick={() => setPage(page - 1)} disabled={page === 1}>이전</Button>
                <span className='mx-2'>{page}</span>
                <Button onClick={() => setPage(page + 1)} disabled={page === 10}>다음</Button>
            </div>
        </div>
    )
}

export default SearchPage
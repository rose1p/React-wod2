import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Row, Col, Table, Button, InputGroup, Form, Spinner } from 'react-bootstrap';
import "../Pagination.css";
import Pagination from 'react-js-pagination';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const ShopList = () => {
    const navi = useNavigate();
    const location = useLocation();
    const search = new URLSearchParams(location.search);

    const [list, setList] = useState([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);
    const size = 5;
    const page = search.get("page") ? parseInt(search.get("page")) : 1;
    const [query, setQuery] = useState("");

    const getList = async () => {
        setLoading(true);
        const res = await axios.get(`/shop/list.json?page=${page}&size=5&query=${query}`);
        //console.log(res.data);
        setList(res.data.list);
        setTotal(res.data.total);
        setLoading(false);
    }

    useEffect(() => {
        getList();
    }, [location]);

    const onSubmit = (e) => {
        e.preventDefault();
        navi(`/shop/list?page=1&size=${size}&query=${query}`);
    }

    const onDelete = async (shop, pid) => {
        if (window.confirm(`${shop.pid}번 상품을 삭재하시겠습니까?`)) {
            await axios(`/shop/delete?pid=${shop.pid}`);
            await axios(`/deleteFile?file=${shop.image}`);

            alert("삭제가 완료되었습니다.");
            navi(`/shop/list?page=${page}&size=${size}&query=${query}`);
        }
    }

    if (loading) return <div className='text-center my-5'><Spinner /></div>

    return (
        <div className='my-5'>
            <h1 className='text-center mb-5'>상품목록</h1>
            <Row className='mb-2'>
                <Col md={5}>
                    <form onSubmit={onSubmit}>
                        <InputGroup>
                            <Form.Control onChange={(e) => setQuery(e.target.value)}
                                placeholder='상품명, 제조사' value={query} />
                            <Button className='sm' type='submit'>검색</Button>
                        </InputGroup>
                    </form>
                </Col>
                <Col>
                    <span>상품수: {total}개</span>
                </Col>
            </Row>
            <Table striped bordered hover>
                <thead>
                    <tr className='text-center'>
                        <td colSpan={2}>ID</td>
                        <td>상품명</td><td>상품가격</td>
                        <td>제조사</td><td>등록일</td>
                        <td>조회수</td>
                        <td>삭제</td>
                    </tr>
                </thead>
                <tbody>
                    {list.map(s =>
                        <tr key={s.pid}>
                            <td>{s.pid}</td>
                            <td><img src={`/display?file=${s.image}`} width="50px" /></td>
                            <td>
                                <Link to={`/shop/update/${s.pid}`}>
                                    <div className='ellipsis'>{s.title}</div>
                                </Link>
                            </td>
                            <td className='text-end'>{s.fmtprice}원</td>
                            <td>{s.maker}</td>
                            <td><div className='ellipsis'>{s.fmtdate}</div></td>
                            <td>{s.viewcnt}</td>
                            <td><Button onClick={() => onDelete(s)}
                                variant='danger' className='btn-sm'>삭제</Button></td>
                        </tr>
                    )}
                </tbody>
            </Table>
            <Pagination
                activePage={page}
                itemsCountPerPage={size}
                totalItemsCount={total}
                pageRangeDisplayed={10}
                prevPageText={"‹"}
                nextPageText={"›"}
                onChange={(cpage) => { navi(`/shop/list?page=${cpage}&size=${size}&query=${query}`) }} />
        </div>
    )
}

export default ShopList
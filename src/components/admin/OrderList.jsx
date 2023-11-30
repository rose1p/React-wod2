import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Table, Row, Col, InputGroup, Form, Button } from 'react-bootstrap';
import "../Pagination.css";
import Pagination from "react-js-pagination";
import ModalOrder from '../order/ModalOrder';

const OrderList = () => {
    const [list, setList] = useState([]);
    const [total, setTotal] = useState(0);
    const [key, setKey] = useState('uid');
    const [query, setQuery] = useState('');
    const [page, setPage] = useState(1);
    const size = 3;

    const getList = async () => {
        const res = await axios(`/purchase/admin/list.json?key=${key}&query=${query}&page=${page}&size=${size}`)
        //console.log(res.data);
        setList(res.data.list);
        setTotal(res.data.total);
    };

    useEffect(() => {
        getList();
    }, [page]);

    const onSubmit = (e) => {
        e.preventDefault();
        setPage(1);
        getList();
    };

    const onClickButton = () => {
        setKey("status");
        setPage(1);
        getList();
    };

    const onChangeStatus = (e, oid) => {
        const data = list.map(p => p.oid === oid ? { ...p, status: e.target.value } : p);
        setList(data);
    };

    const onClickStatus = async (oid, status) => {
        await axios.post(`/purchase/update/status`, { oid, status });
        alert("상태변경");
        getList();
    };

    const onChangeKey = (e) => {
        setQuery("");
        setKey(e.target.value);
    };

    return (
        <div className='my-5'>
            <h1 className='text-center mb-5'>주문관리</h1>
            <Row className='mb-2'>
                <Col md={8}>
                    <form onSubmit={onSubmit}>
                        <InputGroup>
                            <Form.Select onChange={onChangeKey}>
                                <option value="oid">주문번호</option>
                                <option value="uname" selected>주문자명</option>
                                <option value="uid">ID</option>
                                <option value="address1">배송지</option>
                                <option value="phone">전화번호</option>
                                <option value="status">주문상태</option>
                            </Form.Select>
                            {key === 'status' ?
                                <Form.Select onChange={(e) => setQuery(e.target.value)}>
                                    <option value="0">결재확인중</option>
                                    <option value="1">결재완료</option>
                                    <option value="2">배송준비중</option>
                                    <option value="3">배송중</option>
                                    <option value="4">배송완료</option>
                                    <option value="5">주문완료</option>
                                </Form.Select>
                                :
                                <Form.Control placeholder='검색어' value={query}
                                    onChange={(e) => setQuery(e.target.value)} />
                            }
                            <Button type='submit'>검색</Button>
                            <span className='mt-2 ms-2'>검색수: {total}건</span>
                        </InputGroup>
                    </form>
                </Col>
                {/* <Col col={4} className='text-end'>
                    <InputGroup>
                        <Form.Select onChange={(e) => setQuery(e.target.value)} onClick={onClickButton}>
                            <option value="0">결재확인중</option>
                            <option value="1">결재완료</option>
                            <option value="2">배송준비중</option>
                            <option value="3">배송중</option>
                            <option value="4">배송완료</option>
                            <option value="5">주문완료</option>
                        </Form.Select>
                    </InputGroup>
                </Col> */}
            </Row>
            <Table bordered striped hover>
                <thead>
                    <tr className='text-center'>
                        <td>주문번호</td>
                        <td>주문자명</td>
                        <td>배송지</td>
                        <td>전화번호</td>
                        <td>주문상품</td>
                        <td>주문상태</td>
                    </tr>
                </thead>
                <tbody className='text-center'>
                    {list.map(p =>
                        <tr key={p.oid}>
                            <td>{p.oid}</td>
                            <td>{p.uname} ({p.uid})</td>
                            <td>{p.address1}</td>
                            <td>{p.phone}</td>
                            <td><ModalOrder p={p}/></td>
                            <td>
                                <InputGroup>
                                    <Form.Select value={p.status} onChange={(e) => onChangeStatus(e, p.oid)}>
                                        <option value="0">결재확인중</option>
                                        <option value="1">결재완료</option>
                                        <option value="2">배송준비중</option>
                                        <option value="3">배송중</option>
                                        <option value="4">배송완료</option>
                                        <option value="5">주문완료</option>
                                    </Form.Select>
                                    <Button onClick={() => onClickStatus(p.oid, p.status)}>변경</Button>
                                </InputGroup>
                            </td>
                        </tr>
                    )}
                </tbody>
            </Table>
            {total > size &&
                <Pagination
                    activePage={page}
                    itemsCountPerPage={size}
                    totalItemsCount={total}
                    pageRangeDisplayed={10}
                    prevPageText={"‹"}
                    nextPageText={"›"}
                    onChange={(page) => setPage(page)} />
            }
        </div>
    )
}

export default OrderList
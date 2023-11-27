import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Row, Col, InputGroup, Button, Form, Tabs, Tab } from 'react-bootstrap';

const ShopUpdate = () => {
    const { pid } = useParams();
    const [form, setForm] = useState("");
    //console.log(".........", pid);
    const ref_file = useRef(null);
    const [src, setSrc] = useState('http://via.placeholder.com/200x200');
    const [file, setFile] = useState(null);

    const getShop = async () => {
        const res = await axios(`/shop/read/${pid}`);
        //console.log(res.data);
        setForm(res.data);
    }

    const { title, lprice, image, fmtdate, maker } = form;

    useEffect(() => {
        getShop();
    }, []);

    const onChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
    }

    const onSubmit = async (e) => {
        e.preventDefault();
        if (window.confirm("수정하시겠습니까?")) {
            //console.log(form);
            await axios.post("/shop/update", form);
            alert("수정이 완료되었습니다.");
        }
    }

    const onChangeFile = (e) => {
        setSrc(URL.createObjectURL(e.target.files[0]))
        setFile(e.target.files[0]);
    }

    const onSaveImage = async () => {
        if (!file) {
            alert("변경할 이미지를 선택해주세요");
        } else {
            if (window.confirm("이미지를 변경하시겠습니까?")) {
                //이미지 저장
                const formData = new FormData();
                formData.append("file", file);
                formData.append("pid", pid);
                await axios.post("/shop/image", formData);
                alert("이미지가 병경되었습니다.");
                await axios(`/deleteFile?file=${image}`);
                getShop();
                setSrc('http://via.placeholder.com/200x200');
                setFile(null);
            }
        }
    }

    return (
        <div className='my-5'>
            <h1 className='text-center mb-5'>상품정보수정</h1>
            <Tabs defaultActiveKey="home"
                id="fill-tab-example" className="mb-3" fill>
                <Tab eventKey="home" title="상품정보">
                    <Row className='justify-content-center'>
                        <Col md={8}>
                            <form className='card p-3' onSubmit={onSubmit}>
                                <InputGroup className='mb-2'>
                                    <InputGroup.Text>상품번호</InputGroup.Text>
                                    <Form.Control value={pid} readOnly />
                                </InputGroup>
                                <InputGroup className='mb-2'>
                                    <InputGroup.Text>상품이름</InputGroup.Text>
                                    <Form.Control name='title' value={title} onChange={onChange} />
                                </InputGroup>
                                <InputGroup className='mb-2'>
                                    <InputGroup.Text>상품가격</InputGroup.Text>
                                    <Form.Control name='lprice' value={lprice} onChange={onChange} />
                                </InputGroup>
                                <InputGroup className='mb-2'>
                                    <InputGroup.Text>제조사</InputGroup.Text>
                                    <Form.Control name='maker' value={maker} onChange={onChange} />
                                </InputGroup>
                                <InputGroup className='mb-2'>
                                    <InputGroup.Text>등록일</InputGroup.Text>
                                    <Form.Control value={fmtdate} readOnly />
                                </InputGroup>
                                <div className='text-center'>
                                    <Button type='submit'>정보수정</Button>
                                    <Button type='reset' className='ms-2' variant='secondary'>수정취소</Button>
                                </div>
                            </form>
                        </Col>
                    </Row>
                </Tab>
                <Tab eventKey="profile" title="상품사진">
                    <Row>
                        <Col>
                            <h5 className='text-center'>변경전</h5>
                            <div className='text-center'>
                                <img src={`/display?file=${image}`} width="100%" style={{ border: '1px solid gray' }} />
                            </div>
                        </Col>
                        <Col>
                            <h5 className='text-center'>변경후</h5>
                            <div className='text-center'>
                                <img onClick={() => ref_file.current.click()}
                                    src={src} width="100%" style={{ cursor: 'pointer', border: '1px solid gray' }} />
                                <input onChange={onChangeFile}
                                    type='file' ref={ref_file} style={{ display: 'none' }} />
                            </div>
                        </Col>
                        <div className='text-center mt-3'>
                            <Button onClick={onSaveImage}
                                className='px-5'>이미지저장</Button>
                        </div>
                    </Row>
                </Tab>
            </Tabs>
        </div>
    )
}

export default ShopUpdate
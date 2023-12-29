import styled from "styled-components";
import { Row, Col, Spin, Form, Input } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import moment from "moment";

import {
  Breadcrumbs,
  ShareSocials,
  PageHeader,
  ModalMessage,
  Button,
} from "components";

const { TextArea } = Input;
const { useForm } = Form;

moment.locale("pt");

const BlogPost = () => {
  const { postUrl } = useParams();
  const [post, setPost] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [message, setMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [comment, setComment] = useState("");
  const [commenterName, setCommenterName] = useState("");
  const [commenterEmail, setCommenterEmail] = useState("");
  const [comments, setComments] = useState([]);
  const [status, setStatus] = useState();
  const [totalComments, setTotalComments] = useState(0);

  const [loadingComments, setLoadingComments] = useState(true);
  const [errorComments, setErrorComments] = useState(false);

  const [form] = useForm();

  useEffect(() => {
    const fetchBlogPost = async () => {
      try {
        const response = await fetch(
          `https://backoffice.petplushies.pt/wp-json/wc/v3/get_blog_post_by_slug?slug=${postUrl}`
        );
        const data = await response.json();

        if (data.success) {
          setPost(data.post);
          setLoading(false);

          try {
            const response = await fetch(
              `https://backoffice.petplushies.pt/wp-json/wc/v3/get_comments?id=${data.post.id}`
            );
            const data_comments = await response.json();
            if (data_comments.success) {
              setComments(data_comments.results.post_comments);
              setLoadingComments(false);

              const commentsCount = data_comments.results.post_comments.length;
              setTotalComments(commentsCount);
              setErrorComments(false);
            } else {
              setErrorComments(true);
            }

            setTimeout(() => {
              setLoading(false);
            }, 1000);
          } catch (error) {
            setError(true);
          }
        } else {
          setLoading(false);
          setMessage(data.message);
        }
      } catch (error) {
        setError(true);
        setMessage(error);
      }
    };

    fetchBlogPost();
  }, [postUrl]);

  const handleComment = (e) => {
    setComment(e.target.value);
  };

  const handleCommenterName = (name) => {
    setCommenterName(name);
  };

  const handleCommenterEmail = (email) => {
    setCommenterEmail(email);
  };

  const handleSubmitComment = (comment, commenterName, commenterEmail) => {
    form
      .validateFields()
      .then(async () => {
        const commentData = {
          post_id: post.id,
          comment: comment,
          commenter:
            commenterName == "" ? "Anónimo" : commenterName.target.value,
          commenter_email: commenterEmail.target.value,
        };

        try {
          const response = await fetch(
            `https://backoffice.petplushies.pt/wp-json/wc/v3/add_post_comment`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ commentData }),
            }
          );
          const data = await response.json();

          setMessage(data.message);
          setStatus("success");
          setIsModalOpen(true);
        } catch (error) {
          setMessage(data.message);
          setStatus("error");
          setIsModalOpen(true);
        }
      })
      .catch((error) => {
        console.error("Erro na validação de campos:", error);
      });
  };

  return (
    <div style={{ position: "relative" }}>
      {loading && !error && (
        <Spinner
          indicator={<LoadingOutlined style={{ fontSize: 50 }} spin />}
        />
      )}
      {error && !loading && <>{message}</>}
      {post != undefined && (
        <>
          <PageHeader
            title={post.title}
            img={post.featured_image}
            alt={`${post.title} - Pet Plushies`}
          />
          <Container>
            <ModalMessage
              status={status}
              message={message}
              isVisible={isModalOpen}
              onClose={() => setIsModalOpen(false)}
            />
            <ContentLocked>
              <Breadcrumbs page="/blog" item={post.title} />
              <StyledRow>
                <div dangerouslySetInnerHTML={{ __html: post.content }} />
                <ShareSocials
                  item={{
                    key: post.id,
                    name: post.title,
                    url: `${post.featured_image}-large_default/${postUrl}.jpg`,
                    picture: post.featured_image,
                    desc: post.excerpt,
                  }}
                  page="blog"
                />
              </StyledRow>
              <CommentSection>
                <Row>
                  <h3>Comentários</h3>
                </Row>
                <CommentsContent>
                  <Col span={7}>
                    <div>
                      <StyledForm
                        form={form}
                        name="comments"
                        layout="vertical"
                        scrollToFirstError
                      >
                        <FormRow>
                          <StyledFormItem
                            name="comment"
                            wrapperCol={24}
                            rules={[
                              {
                                required: true,
                                message: "Por favor escreva o seu comentário.",
                              },
                            ]}
                          >
                            <StyledTextarea
                              onChange={handleComment}
                              rows={4}
                              placeholder="Escreva aqui o seu comentário..."
                            />
                          </StyledFormItem>
                        </FormRow>
                        <FormRow>
                          <StyledFormItem
                            name="commenter_name"
                            wrapperCol={24}
                            label="Nome"
                          >
                            <Input
                              onChange={handleCommenterName}
                              placeholder="Escreva aqui o seu nome..."
                            />
                          </StyledFormItem>
                        </FormRow>
                        <FormRow>
                          <StyledFormItem
                            name="commenter_email"
                            wrapperCol={24}
                            label="E-mail"
                            rules={[
                              {
                                type: "email",
                                message: "O e-mail inserido não é válido.",
                              },
                              {
                                required: true,
                                message: "Por favor insira o seu e-mail.",
                              },
                            ]}
                          >
                            <Input
                              onChange={handleCommenterEmail}
                              placeholder="Escreva aqui o seu e-mail..."
                            />
                          </StyledFormItem>
                        </FormRow>
                        <FormRow>
                          <StyledButton
                            size="large"
                            type="primary"
                            text="Submeter ccmentário"
                            onClick={() =>
                              handleSubmitComment(
                                comment,
                                commenterName,
                                commenterEmail
                              )
                            }
                          />
                        </FormRow>
                      </StyledForm>
                    </div>
                  </Col>
                  <CommentsContainer span={17}>
                    {loadingComments && !errorComments && (
                      <SpinnerComments
                        indicator={
                          <LoadingOutlined style={{ fontSize: 50 }} spin />
                        }
                      />
                    )}
                    {errorComments && !loadingComments && (
                      <>Erro ao carregar os comentários.</>
                    )}
                    {comments.length > 0 ? (
                      <div>
                        <div>{totalComments} comentário(s).</div>
                        {comments.map((c) => {
                          return (
                            <Comment key={c.id}>
                              <div>
                                <b>{c.name}</b>
                                {" a "}
                                <b>
                                  {moment(c.date_created_gmt).format(
                                    "DD [de] MMMM [de] YYYY[, às] HH:mm"
                                  )}
                                </b>
                              </div>
                              <CommentText>{c.comment}</CommentText>
                            </Comment>
                          );
                        })}
                      </div>
                    ) : (
                      <>
                        Não existem comentários nesta publicação. O teu pode ser
                        o primeiro!
                      </>
                    )}
                  </CommentsContainer>
                </CommentsContent>
              </CommentSection>
            </ContentLocked>
          </Container>
        </>
      )}
    </div>
  );
};

const CommentsContainer = styled(Col)`
  position: relative;
  height: 100%;
  overflow: auto;
  max-height: 520px;
  min-height: 400px;
`;

const Comment = styled.div`
  border-bottom: 1px solid var(--black);
  display: flex;
  flex-direction: column;
  padding: 15px 0;
`;

const StyledButton = styled(Button)`
  margin-top: 20px;
`;

const CommentSection = styled(Row)`
  margin-top: 30px;
  flex-direction: column;
`;

const CommentsContent = styled(Row)`
  justify-content: space-between;
`;

const StyledForm = styled(Form)`
  width: 300px;
`;

const FormRow = styled(Row)`
  width: 100%;
`;

const StyledFormItem = styled(Form.Item)`
  width: 100%;
`;

const StyledTextarea = styled(TextArea)`
  width: 100%;
`;

const CommentText = styled.div`
  margin-top: 10px;
`;

const SpinnerComments = styled(Spin)`
  position: absolute;
  background-color: var(--white);
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  z-index: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Spinner = styled(Spin)`
  position: absolute;
  background-color: var(--white);
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Container = styled.div`
  width: 100%;
  background-color: var(--white);
  padding-top: 50px;
`;

const Content = styled(Row)`
  padding: 0 25px;
  width: 100%;
  flex-direction: column;
`;

const ContentLocked = styled(Content)`
  max-width: 1440px;
  margin: auto;
  position: relative;
`;

const StyledRow = styled(Row)`
  justify-content: space-between;
`;

export default {
  path: "/blog/:postUrl",
  exact: true,
  component: BlogPost,
};

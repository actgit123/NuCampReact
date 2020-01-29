import React,{ Component }  from 'react';
import { Card, CardImg, CardText, Button, CardBody, CardTitle, Breadcrumb, BreadcrumbItem,
    Modal, ModalHeader, ModalBody, Label } from 'reactstrap';
import { Link } from 'react-router-dom';
import { Control, LocalForm, Errors} from 'react-redux-form';
import { Loading } from './LoadingComponent';
import { baseUrl } from '../shared/baseUrl';

const required = val => val && val.length;
const maxLength = len => val => !val || (val.length <= len);
const minLength = len => val => val && (val.length >= len);
class CommentForm extends Component
 {
    constructor(props)
    {
        super(props);
           this.state = {
            author: '',
            rating: '',
            comments: '',
          isModalOpen: false
        };
       this.toggleModal = this.toggleModal.bind(this);
       this.handleSubmit = this.handleSubmit.bind(this);
    }
       toggleModal(){
        this.setState({
            isModalOpen: !this.state.isModalOpen
        });
    }
    handleSubmit(values) {
        this.toggleModal();
        this.props.addComment(this.props.campsiteId, values.rating, values.author, values.text);
    
    }

    render() {
        return (
            <>
                <span className="navbar-text ml-auto">
                    <Button outline onClick={this.toggleModal}>
                        <i className="fa fa-pencil fa-lg" />Submit Comment
                    </Button>
                </span>

                <Modal isOpen={this.state.isModalOpen} toggle={this.toggleModal}>
                    <ModalHeader toggle={this.toggleModal}>Submit Comment</ModalHeader>
                    <ModalBody>
                        <LocalForm onSubmit={values => this.handleSubmit(values)}>
                            <div className="group">
                                <Label htmlFor="Rating">Rating</Label>
                                <Control.select model=".rating" name="rating" className="form-control">
                                    <option>1</option>
                                    <option>2</option>
                                    <option>3</option>
                                    <option>4</option>
                                    <option>5</option>
                                </Control.select>

                                <Label htmlFor="author">Your Name</Label>
                                <Control.text model=".author" name="author" className="form-control" validators={{
                                    required,
                                    minLength: minLength(2),
                                    maxLength: maxLength(15)
                                }}
                                />
                                <Errors
                                    className="text-danger"
                                    model=".author"
                                    show="touched"
                                    component="div"
                                    messages={{
                                        minLength: 'Must be at least 2 characters',
                                        maxLength: 'Must be 15 characters or less'
                                    }}
                                />
                                <Label htmlFor="comment">Comment</Label>
                                <Control.textarea rows="6" model=".text" name="text" className="form-control"></Control.textarea>
                            </div>
                            <div className="group mt-3">
                                <Button value="submit" color="primary">Submit</Button>
                            </div>
                        </LocalForm>
                    </ModalBody>

                </Modal>


            </>
        );
    }
}
function RenderCampsite({ campsite }) {
    return (
        <div className="col-md-5 m-1">
            <Card>
                <CardImg top src={baseUrl + campsite.image} alt={campsite.name} />
                <CardBody>
                    <CardText>{campsite.description}</CardText>
                </CardBody>
            </Card>
        </div>
    );
}
function RenderComments({ comments, addComment, campsiteId }) {
    if (comments) {
        return (
            <div className="col-md-5 m-1">
                <h4>comments</h4>
                <div>
                    {
                        comments.map(comment => <div key={comment.id}>{comment.text} <p> {comment.author}, {new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: '2-digit' }).format(new Date(Date.parse(comment.date)))}</p></div>)
                    }
                     <CommentForm campsiteId={campsiteId} addComment={addComment} />
                </div>
            </div>

        );
    }
}
function CampSiteInfo(props) {
    
    if (props.isLoading) {
        return (
            <div className="container">
                <div className="row">
                    <Loading />
                </div>
            </div>
        );
    }
    if (props.errMess) {
        return (
            <div className="container">
                <div className="row">
                    <div className="col">
                        <h4>{props.errMess}</h4>
                    </div>
                </div>
            </div>
        );
    }
    if (props.campsite) {
        return (
            <div className="container">
                <div className="row">
                    <div className="col">
                        <Breadcrumb>
                            <BreadcrumbItem><Link to="/directory">Directory</Link></BreadcrumbItem>
                            <BreadcrumbItem active>{props.campsite.name}</BreadcrumbItem>
                        </Breadcrumb>
                        <h2>{props.campsite.name}</h2>
                        <hr />
                    </div>
                </div>
                <div className="row">
                    <RenderCampsite campsite={props.campsite} />
                    <RenderComments comments={props.comments}
                                    addComment={props.addComment}
                                    campsiteId={props.campsite.id} />
                </div>
            </div>
        );
    }
    return (<div />);
}


export default CampSiteInfo;
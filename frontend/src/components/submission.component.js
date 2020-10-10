import React, {Component} from 'react';
import axios from 'axios';
const BACK_PORT = 4000

export default class Submission extends Component {
    constructor(props){
        super(props);


        //var localImageUrl = this.fetchImage(this.props.sub.submission_img_url);
        //console.log(`local image url: ${localImageUrl}`)
        this.state = {imageUrl: ''}
        this.fetchImage = this.fetchImage.bind(this);
        this.makePost = this.makePost.bind(this);
        this.deleteSub = this.deleteSub.bind(this);

        

        //functions
    }

    componentDidMount(){
        this.fetchImage(this.props.sub.submission_img_url);
    }

        //refactor to a new js file if this is working
    fetchImage(urlFromSub) {
            //const imageName = 'daffycolorado.JPG'
            const imageName = urlFromSub.split('/').slice(-1)[0];
            const url = `http://localhost:${BACK_PORT}/fetchImage/${imageName}`
            axios.get(url, {responseType: 'blob'})
            .then(res => {
                //console.log(`ImageData: ${res.data} `)
                //var file = new File( res.data, "image", { type: "image/jpeg" } );
                var localImageUrl = URL.createObjectURL(res.data);
                //return (<img src={imageUrl} />);
                //return imageUrl; 
                this.setState({imageUrl: localImageUrl});          
            })
        }

    makePost(e){
        const newPost = {
            post_pack_url: this.props.sub.submission_pack_url,
            post_img_url: this.props.sub.submission_img_url,
            post_date: "default",
            post_submitter: this.props.sub.submission_user,
            post_accepter: "default",
            post_title: this.props.sub.submission_title,
            post_desc: this.props.sub.submission_desc
        }        

        axios.post(`http://localhost:${BACK_PORT}/molten/posts/add`,newPost)
            .then((res)=>{
                const oldSubId = this.props.sub._id;
                //console.log(`${oldSubId}`);
                axios.delete(`http://localhost:${BACK_PORT}/molten/submissions/delete/${oldSubId}`)
                    .then((res)=>{
                        this.props.history.push('/');
                    })
            });

    }

    deleteSub(){
        const subId = this.props.sub._id;
        //TODO: CONFIRM WINDOW
        axios.delete(`http://localhost:${BACK_PORT}/molten/submissions/delete/${subId}`)
            .then((res)=>{
                this.props.submissionDeleted(subId);
            })
    }

    // addPostToDB(){

    // }


    render(){
        //var imageUrl=this.fetchImage(this.props.sub.submission_img_url);
        return(
            <div>
            <tr>    
                    <td>
                        <button onClick={this.makePost}>Post</button>
                        <button onClick={this.deleteSub}>Delete</button>
                    </td>          
                    <td>{this.props.sub.submission_title}</td>
                    <td>{this.props.sub.submission_desc}</td>
                    <td>{this.props.sub.submission_pack_url}</td>
                    <td>{this.props.sub.submission_img_url}</td>
                    <td>{this.props.sub.submission_user}</td>
                    <td>{this.props.sub.submission_date}</td>
                    <img style={{height:"300px"}} src={this.state.imageUrl} />
            </tr>
            </div>

        );
    }
}
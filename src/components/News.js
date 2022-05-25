import React, { Component } from "react";
import NewsItem from "./NewsItem";
import Spiner from "./Spiner";
import PropTypes from "prop-types";
import InfiniteScroll from "react-infinite-scroll-component";
 

export class News extends Component {
  static dafaultProps = {
    country: "in",
    pageSize: 6,
    // category : general
  };
  
  capitalizeFirsrLetter = (string) =>{
      return string.charAt(0).toUpperCase()+ string.slice(1);
  }
  constructor(props) {
    super(props);
    // console.log("hello i'm constructor from News component");
    this.state = {
      articles: [],
      loading: true,
      page: 1,
      totalResults: 0
    };
    document.title= `${this.capitalizeFirsrLetter(this.props.category)} - NewsMonkey` ;
  }

  async updateNews() {
    const url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apikey=d9780b0d94b24892ad4dca97e653836d&page=${this.state.page}&pageSize=${this.props.pageSize}`;
    this.setState({ loading: true });
    let data = await fetch(url);
    let parsedData = await data.json();
    console.log(parsedData);
    this.setState({
      articles: parsedData.articles,
      totalResults: parsedData.totalResults,
      loading: false,
    });
  }
  async componentDidMount() {
    this.updateNews();
  }

  handlePrevClick = async () => {
    this.setState({ page: this.state.page - 1 });
    this.updateNews();
  };
  handleNextClick = async () => {
    this.setState({ page: this.state.page + 1 });
    this.updateNews();
  };

  fetchMoreData = async () => {
      this.setState({page: this.state.page +1});
      const url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apikey=d9780b0d94b24892ad4dca97e653836d&page=${this.state.page}&pageSize=${this.props.pageSize}`;
    this.setState({ loading: true });
    let data = await fetch(url);
    let parsedData = await data.json();
    console.log(parsedData);
    this.setState({
      articles: this.state.articles.concat(parsedData.articles),
      totalResults: parsedData.totalResults,
      loading: false,
    });  
  };

//   fetchMoreData = async () => {
//     this.setState({page: this.state.page +1});
//     const url = "https://newsapi.org/v2/everything?q=apple&from=2022-02-23&to=2022-02-23&sortBy=popularity&apiKey=22029e47952c490f974e29cabd42b5fd";
//   this.setState({ loading: true });
//   let data = await fetch(url);
//   let parsedData = await data.json();
//   console.log(parsedData);
//   this.setState({
//     articles: this.state.articles.concat(parsedData.articles),
//     totalResults: parsedData.totalResults,
//     loading: false,
//   });  
// };

  render() {
    return (
      <div className="container my-3">
        <h1 className="text-center" style={{ margin: "40px 0px" }}>
          <u> NewsMonkey- Today's Top {this.capitalizeFirsrLetter(this.props.category)} Headlines </u>
        </h1>
        {this.state.loading && <Spiner />}
        <InfiniteScroll
          dataLength={this.state.articles.length}
          next={this.fetchMoreData}
          hasMore={this.state.articles.length !==this.state.totalResults}
          loader={<Spiner/>}
        >
            <div className="container">
        <div className="row">
          {this.state.articles.map((element) => {
              return (
                <div className="col-md-4" key={element.url}>
                  <NewsItem
                    title={element.title ? element.title : ""}
                    description={element.description ? element.description : ""}
                    imageUrl={element.urlToImage}
                    newsUrl={element.url}
                    author={element.author}
                    date={element.publishedAt}
                    source={element.source.name}
                  />
                </div>
              );
            })}
        </div>
        
        </div>
        </InfiniteScroll>
        
        
      </div>
    );
  }
}

export default News;

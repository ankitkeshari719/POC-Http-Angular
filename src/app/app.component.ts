import { PostService } from './post.service';
import { Post } from './post.model';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from "rxjs/operators";
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit , OnDestroy{
  loadedPosts = [];
  isLoading = false;
  error = null;
  private postsSub: Subscription;

  constructor(private http: HttpClient , private postService : PostService) {}

  ngOnInit() {
    this.getPosts();
  }

  onFetchPosts() {
    this.getPosts();
  }

  onCreatePost(postData: Post) {
    this.postService.createAndStorePost(postData)
      .subscribe(
        responseData => {
          console.log(responseData);
          this.getPosts();
        },
        error => {
          this.isLoading = false;
          this.error = error.message;
        }
      );
  } 

  onClearPosts() {
    this.postService.deletePosts().subscribe(
      response => {
        console.log(response);
        this.getPosts();
      },
      error => {
        this.isLoading = false;
        this.error = error.message;
      })
  }


  getPosts() {
    this.isLoading = true;
    this.postsSub = this.postService.fetchPosts().subscribe(
      posts => {
        this.isLoading = false;
        this.loadedPosts = posts;
      },
      error => {
        this.isLoading = false;
        this.error = error.message;
      }
    );
  }

  ngOnDestroy(): void {
    this.postsSub.unsubscribe();
  }

  onHandleError() {
    this.error = null;
  }
}

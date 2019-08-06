import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse, HttpEventType } from '@angular/common/http';
import { Post } from './post.model';
import { Injectable } from '@angular/core';
import { map, catchError, tap } from "rxjs/operators";
import { Subject, throwError, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  error = new Subject<string>();

  constructor(private http: HttpClient) { }

  createAndStorePost(postData : Post) {
    const headers = new HttpHeaders(
      {
        'Content-Type': 'application/json',
        'Authorization': 'my-auth-token'
      }
    );
    
    let searchParams = new HttpParams();
    searchParams = searchParams.append('print','preety');
    searchParams = searchParams.append('custonKey','key');
    return this.http
    .post<Post>(
        'https://http-request-b951f.firebaseio.com/posts.json',
        postData,{observe:'response', 'headers':headers, params: searchParams}
    )
    .pipe(
      catchError(this.handleError)
    );;
  }

  fetchPosts() {
    return this.http.get<{ [key: string]: Post }>('https://http-request-b951f.firebaseio.com/posts.json')
      .pipe(
        map(responseData => {
        const postsArray: Post[] = [];
        for (const key in responseData) {
          if (responseData.hasOwnProperty(key)) {
            postsArray.push({ ...responseData[key], id: key });
          }
        }
        return postsArray;
        }),
        catchError(error => {
          return throwError(error);
        })
      );
  }

  deletePosts() {
    return this.http
      .delete('https://http-request-b951f.firebaseio.com/posts.json', { observe: 'events', responseType: 'text' })
      .pipe(tap(events => {
        console.log(events);
        if (events.type === HttpEventType.Sent) {
          console.log(events);
        }
        if (events.type === HttpEventType.Response) {
          console.log(events.body);
        }
      }));
  }

  private handleError(error: HttpErrorResponse) {
  if (error.error instanceof ErrorEvent) {
    // A client-side or network error occurred. Handle it accordingly.
    console.error('An error occurred:', error.error.message);
  } else {
    // The backend returned an unsuccessful response code.
    // The response body may contain clues as to what went wrong,
    console.error(
      `Backend returned code ${error.status}, ` +
      `body was: ${error.error}`);
  }
  // return an observable with a user-facing error message
  return throwError(
    'Something bad happened; please try again later.');
};
}

import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { PostsService } from '../posts.service';
import { ActivatedRoute, Router } from "@angular/router";
import { AppStateService } from "../app-state.service";

export enum PostFormMode {
  Add,
  Edit
}

@Component({
  selector: 'app-post-form',
  templateUrl: './post-form.component.html',
  styleUrls: ['./post-form.component.scss']
})
export class PostFormComponent implements OnInit {
  mode: PostFormMode = PostFormMode.Add;
  postId: number | null = null;
  formSubmitted = new EventEmitter();

  post = {
    title: '',
    body: ''
  };

  constructor(private router: Router, private route: ActivatedRoute, private postsService: PostsService, private appState: AppStateService) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.mode = PostFormMode.Edit;
        this.postId = parseInt(params['id'], 10);

        this.postsService.getPost(this.postId).subscribe(post => {
          this.post = post;
        });
      } else {
        this.mode = PostFormMode.Add;
      }
    });
  }

  onSubmit(): void {
    if (this.mode === PostFormMode.Add) {
      this.postsService.createPost(this.post).subscribe(newPost => {
        this.appState.addPost(newPost);
        this.router.navigate(['/']);
      });
    } else if (this.mode === PostFormMode.Edit) {
      this.postsService.updatePost(this.post).subscribe(updatedPost => {
        this.appState.updatePost(updatedPost);
        this.router.navigate(['/']);
      });
    }
  }
}

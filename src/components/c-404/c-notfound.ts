import { Component, OnInit } from "@angular/core";
import { Title } from "@angular/platform-browser";

@Component({
  selector: "app-c-notfound",
  templateUrl: "./c-notfound.html",
  styleUrls: ["./c-notfound.sass"],
})
export class CNotFoundComponent implements OnInit {
  readonly componentTitle = "Error 404! (Not Found)";
  constructor(private title: Title) {}
  ngOnInit(): void {
    this.title.setTitle(`${this.componentTitle}`);
  }
}

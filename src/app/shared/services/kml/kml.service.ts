import { Injectable } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Observable } from 'rxjs/Rx';

import { Story, User } from '../../models';
import { UserService } from '../user.service';
import html from './html-templates';
import xml from './xml-templates';

@Injectable()
export class KmlService {

  constructor(
    private datePipe: DatePipe,
    private userService: UserService,
  ) { }

  tour(stories: Story[], user: User): string {
    const placemarks: string = stories.map((story, i) => xml.placemark({
      id: story.$key,
      title: story.title,
      lat: story.map.lat,
      long: story.map.long,
      html: html.bubble({
        imageUrl: story.coverURL,
        dateText: this.datePipe.transform(story.dateStart),
        ownerDisplayName: user.displayName,
        description: story.description,
      }),
    })).join('\n');
    const tourData: string = stories.map((story, i) => `
      ${xml.tour.toggleBallon(story.$key, true)}
      ${this.fly360(story)}
    `).join('\n');
    const tour: string = xml.tour.document(tourData);
    const document: string = xml.document(`${placemarks}${tour}`);
    return this.minify(document);
  }

  soloTour(stories: Story[], focus: Story, user: User): string {
    const placemarks: string = stories.map((story, i) => xml.placemark({
      id: story.$key,
      title: story.title,
      lat: story.map.lat,
      long: story.map.long,
      html: html.bubble({
        imageUrl: story.coverURL,
        dateText: this.datePipe.transform(story.dateStart),
        ownerDisplayName: user.displayName,
        description: story.description,
      }),
    })).join('\n');
    const tour: string = xml.tour.document(`
      ${xml.tour.toggleBallon(focus.$key, true)}
      ${this.fly360(focus)}
    `);
    const document: string = xml.document(`${placemarks}${tour}`);
    return this.minify(document);
  }

  private fly360(story: Story): string {
    const headings = Array.from(Array(36), (_, i) => i * 10); // 360º in stacks of 10
    return headings.map(heading => (
      xml.tour.flyTo({
        heading,
        lat: story.map.lat,
        long: story.map.long,
      })
    )).join('\n');
  }

  private minify(kmlText: string): string {
    return kmlText.trim().replace(/>\s+</g, '><');
  }
}

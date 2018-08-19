import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <div>
      <flip-book [content]="content"></flip-book>
    </div>
    <div>
      <button (click)="onButtonClick()">Change content</button>
    </div>
  `
})
export class AppComponent {
  private content = "You sit down between the three Hobbits, licking your lips as you remember the tender taste of their flesh. Grabbing the nearest one, you sink your teeth ravenously into its meaty rump and let out a soft, low growl of contentment. For a short while you feast messily on the hapless creatures. Each Hobbit was carrying a small pouch of those flat, round, shiny pieces of metal and you may take these with you if you wish. They are, in fact, Go ... The pain is unbearable! Summoning up all your energy, you open your eyes - first one, then the other. They narrow to slits as they adjust themselves to the strain of trying to see once more, then relax as they make out familiar shapes in the dim light: a dirt floor, rocky walls ... Then the pain takes over. Your head rocks. Your eyes submit and close tightly in an agonized grimace. Instinctively you raise your hands to cup your face, and a low moan mingles with the rasping sound as your rough fingers rub the scaly skin above your eyes. After some time the pain begins to ease. You open your eyes once more and peer out from between your gnarled fingers. You seem to be at the dead end of a passageway. Your surroundings are barely visible ...You sit down between the three Hobbits, licking your lips as you remember the tender taste of their flesh. Grabbing the nearest one, you sink your teeth ravenously into its meaty rump and let out a soft, low growl of contentment. For a short while you feast messily on the hapless creatures. Each Hobbit was carrying a small pouch of those flat, round, shiny pieces of metal and you may take these with you if you wish. They are, in fact, Go ... The pain is unbearable! Summoning up all your energy, you open your eyes - first one, then the other. They narrow to slits as they adjust themselves to the strain of trying to see once more, then relax as they make out familiar shapes in the dim light: a dirt floor, rocky walls ... Then the pain takes over. Your head rocks. Your eyes submit and close tightly in an agonized grimace. Instinctively you raise your hands to cup your face, and a low moan mingles with the rasping sound as your rough fingers rub the scaly skin above your eyes. After some time the pain begins to ease. You open your eyes once more and peer out from between your gnarled fingers. You seem to be at the dead end of a passageway. Your surroundings are barely visible ..."


  onButtonClick() {
    this.content = "Blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah ";
  }

}

import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ShoppingEditComponent } from "./shopping-edit/shopping-edit.component";
import { ShoppingListRoutingModule } from "./shopping-list-routing.module";
import { ShoppingListComponent } from "./shopping-list.component";
import { ShoppingListService } from "./shopping-list.service";

@NgModule({
  declarations: [ShoppingListComponent, ShoppingEditComponent],
  imports: [CommonModule, FormsModule, ShoppingListRoutingModule],
  providers: [ShoppingListService]
})
export class ShoppingListModule {}
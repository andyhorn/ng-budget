import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SidebarComponent } from './sidebar/sidebar.component';
import { TransactionComponent } from './components/transaction/transaction.component';

import {MatDialogModule} from '@angular/material/dialog';
import {MatDividerModule} from '@angular/material/divider';
import { MatInputModule } from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {MatIconModule} from '@angular/material/icon';
import { FormsModule } from "@angular/forms";
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatNativeDateModule } from "@angular/material/core";
import {MatExpansionModule} from '@angular/material/expansion';
import { CalendarComponent } from './calendar/calendar.component';
import {MatTableModule} from '@angular/material/table';
import { NetFlowIconComponent } from './components/net-flow-icon/net-flow-icon.component';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatMenuModule} from '@angular/material/menu';
import {MatListModule} from '@angular/material/list';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { FileSaveDialogComponent } from './components/file-save-dialog/file-save-dialog.component';
import { SettingsDialogComponent } from './components/settings-dialog/settings-dialog.component';
import { FrequencyDisplayComponent } from './components/frequency-display/frequency-display.component';
import { EditTransactionDialogComponent } from './components/edit-transaction-dialog/edit-transaction-dialog.component';
import { TransactionFormComponent } from './components/transaction-form/transaction-form.component';
import { FinanceDetailsComponent } from './components/finance-details/finance-details.component';
import { OccurrenceCardComponent } from './components/occurrence-card/occurrence-card.component';

@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
    TransactionComponent,
    CalendarComponent,
    NetFlowIconComponent,
    FileSaveDialogComponent,
    SettingsDialogComponent,
    FrequencyDisplayComponent,
    EditTransactionDialogComponent,
    TransactionFormComponent,
    FinanceDetailsComponent,
    OccurrenceCardComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatDividerModule,
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    FormsModule,
    MatIconModule,
    MatDialogModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatExpansionModule,
    MatTableModule,
    MatToolbarModule,
    MatMenuModule,
    MatListModule,
    MatSnackBarModule,
    MatSlideToggleModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

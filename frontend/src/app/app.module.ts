import { provideHttpClient } from "@angular/common/http";
import { BrowserModule } from "@angular/platform-browser";
import { RouterModule } from '@angular/router';
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MessagesComponent } from "./messages/messages.component";
import { AppComponent } from "./app.component";
import { AppRoutingModule } from "./app-routing.module";
import { TaxisComponent } from "./taxis/taxis.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { TaxiDetailComponent } from "./taxi-detail/taxi-detail.component";
import { TaxiAddComponent } from "./taxi-add/taxi-add.component";
import { MotoristasComponent } from "./motoristas/motoristas.component";
import { MotoristaAddComponent } from "./motorista-add/motorista-add.component";
import { MotoristaDetailComponent } from "./motorista-detail/motorista-detail.component";
import { ServicosComponent } from './servicos/servicos.component';
import { ServicoAddComponent } from './servico-add/servico-add.component';
import { ServicoDetailComponent } from './servico-detail/servico-detail.component';
import { ServicoViagemComponent} from './servico-viagem/servico-viagem.component';
import { TaxiPedidoComponent } from './taxi-pedido/taxi-pedido.component';
import { TurnoAddComponent } from './turno-add/turno-add.component';
import { TurnoListComponent } from './turno-list/turno-list.component';
import { MotoristaDashboardComponent } from './motorista-dashboard/motorista-dashboard.component';
import { MotoristaPedidoComponent } from './motorista-pedido/motorista-pedido.component';
import { RegistarViagemComponent } from './registar-viagem/registar-viagem.component';
import { CommonModule } from '@angular/common';
import { GestorMotoristasComponent } from './gestor-motoristas/gestor-motoristas.component';
import { GestorTaxisComponent } from './gestor-taxis/gestor-taxis.component';
import { GestorRelatoriosComponent } from './gestor-relatorios/gestor-relatorios.component';


@NgModule({
    declarations: [
        AppComponent,
        MessagesComponent,
        TaxisComponent,
        TaxiDetailComponent,
        DashboardComponent,
        TaxiAddComponent,
        MotoristasComponent,
        MotoristaAddComponent,
        MotoristaDetailComponent,
        ServicosComponent,
        ServicoAddComponent,
        ServicoDetailComponent,
        ServicoViagemComponent,
        TurnoAddComponent,
        TurnoListComponent,
        MotoristaDashboardComponent,
        MotoristaPedidoComponent,
        RegistarViagemComponent,
        GestorRelatoriosComponent,

        ],
    imports: [
        BrowserModule,
        FormsModule,
        AppRoutingModule,
        ReactiveFormsModule,
        TaxiPedidoComponent,
        RouterModule,
        CommonModule,
        GestorMotoristasComponent,
        GestorTaxisComponent,
    ],
    providers: [
        provideHttpClient()
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }

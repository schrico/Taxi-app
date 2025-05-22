import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { TaxisComponent } from './taxis/taxis.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { TaxiDetailComponent } from './taxi-detail/taxi-detail.component';
import { TaxiAddComponent } from './taxi-add/taxi-add.component';
import { MotoristasComponent } from './motoristas/motoristas.component';
import { MotoristaAddComponent } from './motorista-add/motorista-add.component';
import { MotoristaDetailComponent } from './motorista-detail/motorista-detail.component';
import { ServicosComponent } from "./servicos/servicos.component"
import { ServicoAddComponent } from './servico-add/servico-add.component';
import { ServicoDetailComponent } from './servico-detail/servico-detail.component';
import { ServicoViagemComponent} from './servico-viagem/servico-viagem.component';
import { MotoristaDashboardComponent } from './motorista-dashboard/motorista-dashboard.component';
import { TaxiPedidoComponent } from './taxi-pedido/taxi-pedido.component';
import { TaxiAcompanhamentoComponent } from './pedido-acompanhamento/pedido-acompanhamento.component';
import { TurnoAddComponent } from './turno-add/turno-add.component';
import { TurnoListComponent } from './turno-list/turno-list.component';
import { MotoristaPedidoComponent } from './motorista-pedido/motorista-pedido.component';
import { RegistarViagemComponent } from './registar-viagem/registar-viagem.component';
import { GestorDashboardComponent } from "./gestor-dashboard/gestor-dashboard.component";
import { GestorMotoristasComponent } from "./gestor-motoristas/gestor-motoristas.component";
import { GestorTaxisComponent } from "./gestor-taxis/gestor-taxis.component";
import { GestorRelatoriosComponent } from "./gestor-relatorios/gestor-relatorios.component";

const routes: Routes = [
    { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
    { path: 'taxis', component: TaxisComponent },
    { path: 'dashboard', component: DashboardComponent },
    { path: 'taxis/detail/:id', component: TaxiDetailComponent },
    { path: 'taxis/addtaxi', component: TaxiAddComponent },
    { path: 'motoristas', component: MotoristasComponent },
    { path: 'motoristas/add', component: MotoristaAddComponent },
    { path: 'motoristas/:id', component: MotoristaDetailComponent },
    { path: 'servicos', component: ServicosComponent},
    { path: 'servicos/add', component: ServicoAddComponent },
    { path: 'servicos/:id', component: ServicoDetailComponent },
    { path: 'servicos-viagem', component: ServicoViagemComponent },
    { path: 'dashboard/motorista-dashboard', component: MotoristaDashboardComponent },
    { path: 'taxi-pedido', component: TaxiPedidoComponent },
    { path: 'acompanhamento', component: TaxiAcompanhamentoComponent },
    { path: 'turnos/add', component: TurnoAddComponent },
    { path: 'turnos/list', component: TurnoListComponent },
    { path: 'motorista-pedido', component: MotoristaPedidoComponent },
    { path: 'registar-viagem', component: RegistarViagemComponent },
    { path: 'gestor-dashboard', component: GestorDashboardComponent },
    { path: 'gestor/motoristas', component: GestorMotoristasComponent },
    {path: 'gestor/taxis', component: GestorTaxisComponent},
    {path: 'gestor/relatorios', component: GestorRelatoriosComponent},

];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }



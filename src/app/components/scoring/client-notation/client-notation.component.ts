import { Component, OnInit,ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CorporateService } from '../../../services/corporate.service';
import { FinancingTypeService } from '../../../services/financing-type.service';
import { JuridicalFormService } from '../../../services/juridical-form.service';
import { ActivitySectorService } from '../../../services/activity-sector.service';
import { BranchService } from '../../../services/branch.service';
import { NgToastService } from 'ng-angular-popup';
import { Retail } from '../../../classes/retail';
import { RetailService } from '../../../services/retail.service';
import { Corporate } from '../../../classes/corporate';
import { Classe, ClientCategory, Decision, EmployementStatus, FamilySituation } from '../../../classes/enum';
import { ClientNotation } from '../../../classes/client-notation';
import { ClientNotationService } from '../../../services/client-notation.service';
import { ClientSegmentConfigService } from '../../../services/client-segment-config.service';
import { ClientSegmentConfig } from '../../../classes/client-segment-config';
import { JuridicalForm } from '../../../classes/juridical-form';
import { ActivitySector } from '../../../classes/activity-sector';
import { ClientScore } from '../../../classes/ClientScore';

@Component({
  selector: 'app-client-notation',
  templateUrl: './client-notation.component.html',
  styleUrl: './client-notation.component.css'
})
export class ClientNotationComponent  implements OnInit{
  //FILTRER LA LISTE DES ACTIVITES :
  
  searchTextCorpo: string = '';
  pCorpo: number = 1; // Page courante
  itemsPerPageCorpo: number = 10; // Nombre d'éléments par page
  juridicalForms : JuridicalForm[]=[];
  activities : ActivitySector[]=[];


  searchTextRetail: string = '';
  pRetail: number = 1; // Page courante
  itemsPerPageRetail: number = 10; // Nombre d'éléments par page
  clientScore : number =0;
  corporates : Corporate[]=[];



  corporate: Corporate = new Corporate();
  clientSegmentConfig: ClientSegmentConfig = new ClientSegmentConfig();
  retails : Retail[]=[];
  retail: Retail = new Retail();

  isScored : Boolean = false;
  clientNotation: ClientNotation = new ClientNotation();

  //commun
  scoreCapitalImpaye = 0;
  scoreCapitalNominal=0;
  //corpo
  scoreClientCategory =0;
  scoreAgeSociety =0;
  scoreJuridicalForm=0;
  scoreActivitySector =0;

  scoreNbYearExercice =0;
  scoreNbYearRelationBanque =0;
  scoreQualiteActionnariat =0;
  scoreFiabiliteEtatsFinanciers =0;
  scoreEvolutionMarche =0;
  scoreVisVisConcurrence =0;
  scoreLimiteAutorises =0;
  scoreIncidentsPaiement =0;
  scoreSituationEngagement =0;
  scoreRentabiliteFinancieres =0;
  scoreFondRoulements =0;
  scoreTauxBFR =0;
  scoreAutonomieFinancieres =0;
  scoreLiquiditeGenerale =0;


//
  scoreHistoriqueEntreprise = 0;
  scoreActionnariat = 0;
  scoreMarcheSecteurActivite = 0;
  scoreQualitatif = 0;
  scoreComportementale = 0;
  
  scoreStructureFinanciere = 0;
  scoreSolvabilite = 0;
  scoreFinancierTotal = 0;
//
  pilierFinancier = 0.35;
  pilierQualitatif = 0.25;
  pilierComportemental = 0.40;
//
  scoreFinal = 0; 



  scoreProbabiliste = 0 ;


  //Retail
  scoreAgeRetail =0;
  scoreRevenu =0
  scoreNbrDependents =0 
  scoreSituationFamille =0;
  scoreEmploymentstatus=0;
  scoreEmployerSize=0;
  scoreAncienneteEmployeur=0;
  scoreTauxEndettement = 0;
  scoreAncienneteRelationBanque =0;
  scorePresenceImpaye = 0;
  scoreIncidentPayement = 0;


  scoreEmployeur  = 0; 
  scoreClient = 0;
  scoreComportement = 0;

  constructor(private route: ActivatedRoute, 
    private router: Router, 
    public corpoService : CorporateService,
    public retailService : RetailService  ,
    private clientNotationService : ClientNotationService ,
    private juridicalFormService : JuridicalFormService,
    private activitySectorService : ActivitySectorService,
    private clientSegmentConfigService : ClientSegmentConfigService,
    private cdr: ChangeDetectorRef,
    private toast : NgToastService) { }
  ngOnInit(): void {
    this.loadJuridicalForms();
    this.loadActivitiesSector();
    this.corpoService.getAllClientsCorpo().subscribe(
      res=>{
        this.corporates=res;
    },
      err=>{console.log(err);
      }
    );

    this.retailService.getAllClientsRetail().subscribe(
      res=>{
        this.retails=res;
    },
      err=>{console.log(err);
      }
    );
  }
  //filter par la barre de recherche
  get filteredRetails() {
    return this.retails.filter(retail => 
      (retail.firstName!=null ? retail.firstName.toLowerCase().includes(this.searchTextRetail.toLowerCase()):true) ||
      (retail.lastName!=null ? retail.lastName.toLowerCase().includes(this.searchTextRetail.toLowerCase()) : true) ||
      (retail.contractReference!=null ? retail.contractReference.toLowerCase().includes(this.searchTextRetail.toLowerCase()) : true) 
    );
  }

  get filteredCorporates() {
    return this.corporates.filter(corporate => 
      (corporate.raisonSocial!=null ? corporate.raisonSocial.toLowerCase().includes(this.searchTextCorpo.toLowerCase()):true) ||
      (corporate.clientRequest!=null ? corporate.clientRequest.toLowerCase().includes(this.searchTextCorpo.toLowerCase()) : true) ||
      (corporate.contractReference!=null ? corporate.contractReference.toLowerCase().includes(this.searchTextCorpo.toLowerCase()) : true) 
    );
  }
  get emploiStatusOptions() {
    return Object.values(EmployementStatus);
  }
  loadJuridicalForms(): void {
    this.juridicalFormService.getAllJuridicalForm().subscribe(forms => {
      this.juridicalForms = forms;
    });
  } 
  loadActivitiesSector(): void {
    this.activitySectorService.getAllActivities().subscribe(activities => {
      this.activities = activities;
    });
  }
  showDetailsCorporate(selectedCorporate : any){
    console.log("selectedCorporate.id ="+ selectedCorporate.id);
    this.corpoService.getDetailsCorporate(selectedCorporate.id).subscribe(
      res=>{
        this.corporate=res;
        this.corporate.id = selectedCorporate.id;
    },
      err=>{console.log(err);

      }
    );
  }
  showDetails(selectedRetail : any){
    this.retailService.getDetailsRetail(selectedRetail.id).subscribe(
      res=>{
        this.retail=res;
        this.retail.id = selectedRetail.id;
    },
      err=>{console.log(err);

      }
    );
  }


  calculerScoreCorporate(selectedCorporate : any ){
    
    this.toast.info('Calcul du score en cours...');
    console.log("selectedCorporate = "+selectedCorporate.id);
    this.clientNotationService.getAllClientNotationByClient(selectedCorporate.id).subscribe(
      res=>{
        console.log("getAllClientNotationByClient = "+res);
        if(res != null ){
          this.clientNotation = res;
          console.log("clientNotation = "+this.clientNotation);
			    console.log("clientNotation.id = "+this.clientNotation.id);
		}  
		// Calcul du score Age de la Société
		if(this.corporate.nbYearExercice!==null){

      if(Number(this.corporate.nbYearExercice )<= 1)
			this.scoreNbYearExercice = 0 ;
      else if (Number(this.corporate.nbYearExercice ) > 1  && Number(this.corporate.nbYearExercice ) <= 2)
			this.scoreNbYearExercice = 5 ;
      else if (Number(this.corporate.nbYearExercice ) >2 && Number(this.corporate.nbYearExercice ) <= 5)
			this.scoreNbYearExercice = 10 ;
      else if (Number(this.corporate.nbYearExercice ) >5 && Number(this.corporate.nbYearExercice ) <= 15)
			this.scoreNbYearExercice = 15 ;
      else
			this.scoreNbYearExercice = 20 ;
		}
		//score avec ponderation
		this.scoreNbYearExercice = this.scoreNbYearExercice * 0.50;
		
		
		//Score ancienneté avec la banque
		if(this.corporate.seniorityRelation != null){
      if(Number(this.corporate.seniorityRelation)   <= 1 )
        this.scoreNbYearRelationBanque = 0 ;
      else if(Number(this.corporate.seniorityRelation)  > 1 && Number(this.corporate.seniorityRelation)  <=2 )
        this.scoreNbYearRelationBanque = 5 ;
      else if(Number(this.corporate.seniorityRelation)  > 2 && Number(this.corporate.seniorityRelation)  <=5)
        this.scoreNbYearRelationBanque = 10 ;
      else if(Number(this.corporate.seniorityRelation)  > 5 && Number(this.corporate.seniorityRelation)  <=10)
        this.scoreNbYearRelationBanque = 15 ;
      else if(Number(this.corporate.seniorityRelation) > 10)
        this.scoreNbYearRelationBanque = 20 ;
		}
		//score avec ponderation
		this.scoreNbYearRelationBanque = this.scoreNbYearRelationBanque * 0.50;	
		
      
      
		// Calcul du score Forme Juridique / qualite de l'actionnariat
		if(this.corporate.juridicalForm!==null){
      if(this.corporate.juridicalForm.juridicalFormCode == "SA")
			this.scoreQualiteActionnariat = 0 ;
      else if(this.corporate.juridicalForm.juridicalFormCode == "SARL")
			this.scoreQualiteActionnariat = 5 ;
      else if(this.corporate.juridicalForm.juridicalFormCode == "AUTRES")
			this.scoreQualiteActionnariat = 10 ;
      else if(this.corporate.juridicalForm.juridicalFormCode == "SUARL")
			this.scoreQualiteActionnariat = 15 ;
      else if(this.corporate.juridicalForm.juridicalFormCode == "ETATIQUES")
			this.scoreQualiteActionnariat = 20 ;
		}	
		//score avec ponderation
		this.scoreQualiteActionnariat = this.scoreQualiteActionnariat * 0.35;	
		
		// Calcul du score Fiablite des etats financiers 
		if(this.corporate.fiablityFinancialStatus!==null){
      if(this.corporate.fiablityFinancialStatus == "certifiés avec rapport CAC")
			this.scoreFiabiliteEtatsFinanciers = 20 ;
      else if(this.corporate.fiablityFinancialStatus == "certifiés sans rapport CAC")
			this.scoreFiabiliteEtatsFinanciers = 15 ;
      else if(this.corporate.fiablityFinancialStatus == "certifiés avec reserves")
			this.scoreFiabiliteEtatsFinanciers = 10 ;
      else if(this.corporate.fiablityFinancialStatus == "non certifiés")
			this.scoreFiabiliteEtatsFinanciers = 5 ;
      
		}	
		//score avec ponderation
		this.scoreFiabiliteEtatsFinanciers = this.scoreFiabiliteEtatsFinanciers * 0.30;	
      
		// Calcul du score Catégorie Client
		if(this.corporate.clientCategory!==null){
      if(this.corporate.clientCategory ==ClientCategory.ASSURANCES || this.corporate.clientCategory == ClientCategory.ENTRPRENEUR_INDIVIDUEL ||
        this.corporate.clientCategory == ClientCategory.PROFESSION_LIBERALE)
        this.scoreClientCategory = 5 ;
      else if (this.corporate.clientCategory == ClientCategory.PERSONNE_MORALE_PRIVEE || this.corporate.clientCategory == ClientCategory.PERSONNE_MORALE_PUBLIQUE )
        this.scoreClientCategory = 10 ;
      else if (this.corporate.clientCategory == ClientCategory.BANQUE ||
        this.corporate.clientCategory == ClientCategory.GRANDE_ENTREPRISE_PRIVE ||  
        this.corporate.clientCategory == ClientCategory.GRANDE_ENTREPRISE_PUBLIQUE )
      this.scoreClientCategory = 15 ;
      else
        this.scoreClientCategory = 15 ;
		}
		//score avec ponderation
		this.scoreClientCategory = this.scoreClientCategory * 0.35;
		
      
      
		
		// Calcul du score Secteur d'Activité
		if(this.corporate.activitySector!==null){
      if(this.corporate.activitySector.code == "AGRICULTURE" || this.corporate.activitySector.code == "INDUSTRIE" ||
        this.corporate.activitySector.code == "CONSTRUCTION" ||	this.corporate.activitySector.code == "SERVICES"){
        this.scoreActivitySector = 5 ;
      }else if (this.corporate.activitySector.code == "BANQUE" ||	this.corporate.activitySector.code == "ASSURANCE" || this.corporate.activitySector.code == "IMMOBILIER") {
        this.scoreActivitySector = 10 ;
      } else if (this.corporate.activitySector.code == "ENTREPRENEURSHIP" || this.corporate.activitySector.code == "PUBLIC SERVICES"){
        this.scoreActivitySector = 15;
      }
		}else{
      this.scoreActivitySector = 0;
		}
		//score avec ponderation
		this.scoreActivitySector = this.scoreActivitySector * 0.35;	
		
		// Calcul evolution du marche
		if(this.corporate.evolutionMarche!==null){
      if(this.corporate.evolutionMarche == "secteur en croissance avec debonnes perspectives" ){
			this.scoreEvolutionMarche = 20 ;
      }else if (this.corporate.evolutionMarche== "secteur stable avec debonnes perspectives" ) {
			this.scoreEvolutionMarche = 15 ;
      } else if (this.corporate.evolutionMarche== "secteur stable" ){
			this.scoreEvolutionMarche = 10;
      } else if (this.corporate.evolutionMarche== "secteur en recul avec amélioration en perspectives" ){
			this.scoreEvolutionMarche = 5;
      } else if (this.corporate.evolutionMarche== "secteur en recul sans perspectives" ){
			this.scoreEvolutionMarche = 0;
      }
		}
		//score avec ponderation
		this.scoreEvolutionMarche = this.scoreEvolutionMarche * 0.35;		
      
		// Calcul score positionnement vis a vis de la concurrence 
		if(this.corporate.positionnementCommerce!==null){
      if(this.corporate.positionnementCommerce == "Leader sur le marché" ){
			this.scoreVisVisConcurrence = 20 ;
      }else if (this.corporate.positionnementCommerce== "Challenger / Spécialiste" ) {
			this.scoreVisVisConcurrence = 15 ;
      } else if (this.corporate.positionnementCommerce== "Suiveur" ){
			this.scoreVisVisConcurrence = 10;
      } else if (this.corporate.positionnementCommerce== "Outsider" ){
			this.scoreVisVisConcurrence = 5;
      } else if (this.corporate.positionnementCommerce== "Sortant sur le marché" ){
			this.scoreVisVisConcurrence = 0;
    }
		}
		//score avec ponderation
		this.scoreVisVisConcurrence = this.scoreVisVisConcurrence * 0.30;
		
		//score  historique entreprise
		this.scoreHistoriqueEntreprise = (this.scoreNbYearExercice + this.scoreNbYearRelationBanque) * 0.25;	
		//score actionnariat et management
		this.scoreActionnariat = (this.scoreClientCategory + this.scoreFiabiliteEtatsFinanciers + this.scoreQualiteActionnariat) * 0.40;
		// score marche secteur activite
		this.scoreMarcheSecteurActivite = (this.scoreVisVisConcurrence + this.scoreEvolutionMarche + this.scoreActivitySector ) * 0.35
		
		
		// Calcul score LE COMPTE FONCTIONNE - T-IL DANS LES LIMITES AUTORISEES 
		if(this.corporate.comportementClient!==null){
      if(this.corporate.comportementClient == "compte crediteur" ){
			this.scoreLimiteAutorises = 20 ;
    }else if (this.corporate.comportementClient== "compte debiteur avec depassement occasionnel" ) {
			this.scoreLimiteAutorises = 10 ;
    } else if (this.corporate.comportementClient== "compte debiteur avec depassement recurrent" ){
			this.scoreLimiteAutorises = 5;
    } else if (this.corporate.comportementClient== "compte debiteur sans autorisation" ){
			this.scoreLimiteAutorises = 0;
    } 
		}
		//score avec ponderation
		this.scoreLimiteAutorises = this.scoreLimiteAutorises * 0.40;
		
		// Calcul score INCIDENTS DE PAIEMENT 
		if(this.corporate.payementIncident!==null){
      if(this.corporate.payementIncident == "Aucun incident" ){
			this.scoreIncidentsPaiement = 20 ;
      }else if (this.corporate.payementIncident== "1 Incident régularisé" ) {
			this.scoreIncidentsPaiement = 15 ;
      } else if (this.corporate.payementIncident== "Supérieur à 1 incident régularisé" ){
			this.scoreIncidentsPaiement = 5;
      } else if (this.corporate.payementIncident== "Incidents non régularisés" ){
			this.scoreIncidentsPaiement = 0;
      } else if (this.corporate.payementIncident== "Nouveau client" ){
			this.scoreIncidentsPaiement = 10;
      } 
		}
		//score avec ponderation
		this.scoreIncidentsPaiement = this.scoreIncidentsPaiement * 0.60;
        
      
		this.scoreComportement = (this.scoreLimiteAutorises + this.scoreIncidentsPaiement) * 0.50 ;
		
		// Calcul score SITUATION DES ENGAGEMENTS
		if(this.corporate.financialRentability!==null){
      if (Number(this.corporate.financialRentability) < 0 )
			this.scoreRentabiliteFinancieres = 0;
      else if (Number(this.corporate.financialRentability)  > 20 )
			this.scoreRentabiliteFinancieres = 20;
		}
		
		//score avec ponderation
		this.scoreRentabiliteFinancieres = this.scoreRentabiliteFinancieres * 0.20 ; 
		
		//calcul score structure financiere / tresorerie 
		//fr
		if(this.corporate.fondRoulement!==null){
      if (Number(this.corporate.fondRoulement) < 0 )
			this.scoreFondRoulements = 0;
      else if (Number(this.corporate.fondRoulement)  > 0.01 )
			this.scoreFondRoulements = 20;
		}
		
		//score avec ponderation
		this.scoreFondRoulements = this.scoreFondRoulements * 0.50 ; 
		
		//BFR
		if(this.corporate.tauxFondRoulement!==null){
      if (Number(this.corporate.tauxFondRoulement) < 40 )
			this.scoreTauxBFR = 0;
      else if (Number(this.corporate.tauxFondRoulement) >= 100 )
			this.scoreTauxBFR = 20;
		}
		
		//score avec ponderation
		this.scoreTauxBFR = this.scoreTauxBFR * 0.50 ; 
		
		//autonomie financiere
		if(this.corporate.autonomieFinanciere!==null){
      if (Number (this.corporate.autonomieFinanciere) < 0 )
			this.scoreAutonomieFinancieres = 0;
      else if (Number (this.corporate.autonomieFinanciere) >= 40 )
			this.scoreAutonomieFinancieres = 20;
		}
		
		//score avec ponderation
		this.scoreAutonomieFinancieres = this.scoreAutonomieFinancieres * 0.50 ;	
      
		//score liquidité 
		if(this.corporate.liquiditeGenerale!==null){
      if (Number (this.corporate.liquiditeGenerale) <= 0 )
			this.scoreLiquiditeGenerale = 0;
      else if (Number (this.corporate.liquiditeGenerale) >= 2 )
			this.scoreLiquiditeGenerale = 20;
		}
		
		//score avec ponderation
		this.scoreLiquiditeGenerale = this.scoreLiquiditeGenerale * 0.50 ;
		
		this.scoreSolvabilite = (this.scoreLiquiditeGenerale  + this.scoreAutonomieFinancieres) * 0.30;
		
		this.scoreStructureFinanciere = (this.scoreTauxBFR  + this.scoreFondRoulements) * 0.20;
		
      
		this.scoreQualitatif = this.scoreHistoriqueEntreprise + this.scoreActionnariat +this.scoreMarcheSecteurActivite
		this.scoreComportementale = (this.scoreSituationEngagement * 0.50 ) + this.scoreComportement;
		this.scoreFinancierTotal = this.scoreRentabiliteFinancieres + this.scoreStructureFinanciere + this.scoreSolvabilite ;
      
		this.clientNotation.finalScore = (this.scoreQualitatif * this.pilierQualitatif ) + (this.scoreComportementale * this.pilierComportemental ) + (this.scoreFinancierTotal * this.pilierFinancier ) ; 
		this.clientNotation.adjustedScore = ((Number(this.clientNotation.finalScore|| 0) -10 )*10) /10;
		this.scoreProbabiliste = 1/ ( 1 + Math.exp( - (this.clientNotation.adjustedScore)));
      
		this.clientNotation.pd = 1 -this.scoreProbabiliste;
      
		if(Number(this.clientNotation.pd)  >= 0  && Number(this.clientNotation.pd) <=  0.1){
      this.clientNotation.decisionOctroi = Decision.Excellente ;
		}else if (Number(this.clientNotation.pd)  >0.1 && Number(this.clientNotation.pd) <=  0.2){
      this.clientNotation.decisionOctroi = Decision.Bonne ;
		}else if (Number(this.clientNotation.pd)  >0.2 && Number(this.clientNotation.pd) <=  0.3){
      this.clientNotation.decisionOctroi = Decision.Moyenne ;
		}else {
      this.clientNotation.decisionOctroi = Decision.Mauvaise ;
		}
    
		if(Number(this.clientNotation.pd)  >= 0  && Number(this.clientNotation.pd) <=  0.1){
      this.clientNotation.classe = Classe.A ;
		}else if (Number(this.clientNotation.pd)  >0.1 && Number(this.clientNotation.pd) <=  0.2){
      this.clientNotation.classe = Classe.B ;
		}else if (Number(this.clientNotation.pd)  >0.2 && Number(this.clientNotation.pd) <=  0.3){
      this.clientNotation.classe = Classe.C ;
		}else {
      this.clientNotation.classe = Classe.D ;
		}

		this.clientNotation.notationDate = new Date();
		

    this.clientSegmentConfigService.getClientSegmentConfigByCode("ENTREPRISE").subscribe(
      res=>{
        this.clientSegmentConfig = res;
        console.log("this.clientSegmentConfig" +this.clientSegmentConfig.segmentCode);
          if (this.clientNotation && this.clientSegmentConfig) {
            console.log("condition verifiee ");
            console.log("this.clientNotation.clientSegmentConfig.id"+this.clientNotation.clientSegmentConfig?.id);
          this.clientNotation.clientSegmentConfig = this.clientSegmentConfig;
          console.log(this.clientNotation.clientSegmentConfig.id);
        } else {
          console.log("clientNotation ou clientSegmentConfig est null");
        }
        if(this.clientNotation.clientSegmentConfig !=null)
          console.log(this.clientNotation.clientSegmentConfig.segmentCode);
        /*
        this.corporate.clientNotation = this.clientNotation;
        */
        this.clientNotation.scoringContractData = this.corporate;
        console.log("this.clientNotation..id"+this.clientNotation?.id);

        this.clientNotationService.editClientNotation(this.clientNotation).subscribe(
          res=>{
            console.log("edit ClientNOtation"+res);
            this.corporate.clientNotation = this.clientNotation ; 
          }, 
          err=>{
            console.log(err);
          }
        );	



      }, err=>{
        console.log(err);
      }
    ); 

      }, 
      err=>{
        console.log(err);
      }
    );
  

    this.toast.success( "Calcul effectué avec succes !" );
  
  }


  calculerScoreRetail(selectedRetail : any){
    this.toast.info('Calcul du score en cours...');
    console.log("selectedRetail = "+selectedRetail.id);
    this.clientNotationService.getAllClientNotationByClient(selectedRetail.id).subscribe(
      res=>{
        console.log("getAllClientNotationByClient = "+res);
        if(res != null ){
          console.log("res.id = "+res.id);
          this.clientNotation = res;
          
          console.log("this.clientNotation.id = "+this.clientNotation.id);
        }
  
        console.log("clientNotation = "+this.clientNotation);
        console.log("351 this.clientNotation.id = "+this.clientNotation.id);
  
        //Employeur contre partie 
  
        // Calcul du score taille employeur
        if(this.retail.employerSize!==null){
          if(this.retail.employerSize =="Grande Entreprise")
            this.scoreEmployerSize = 20 ;
          else if(this.retail.employerSize =="PME")
            this.scoreEmployerSize = 10 ;
          else if(this.retail.employerSize =="TPE")
            this.scoreEmployerSize = 5 ;
        }else{
          this.scoreEmployerSize = 0 ;
        }
  
        //score avec ponderation
        this.scoreEmployerSize = this.scoreEmployerSize * 0.40;
  
        //Score ancienneté avec la banque
        if(this.retail.nbYearExperience != null){
          if(this.retail.nbYearExperience >= 0 && this.retail.nbYearExperience < 2 )
            this.scoreAncienneteEmployeur = 0 ;
          else if(this.retail.nbYearExperience >= 2 && this.retail.nbYearExperience <4 )
            this.scoreAncienneteEmployeur = 5 ;
          else if(this.retail.nbYearExperience >= 4 && this.retail.nbYearExperience <9)
            this.scoreAncienneteEmployeur = 10 ;
          else if(this.retail.nbYearExperience >= 9 && this.retail.nbYearExperience <14)
            this.scoreAncienneteEmployeur = 15 ;
          else
            this.scoreAncienneteEmployeur = 20 ;
        }
        //score avec ponderation
        this.scoreAncienneteEmployeur = this.scoreAncienneteEmployeur * 0.20;
  
        // Calcul du score Secteur d'Activité
        if(this.corporate.activitySector!==null){
          if(this.corporate.activitySector.code == "AGRICULTURE" || this.corporate.activitySector.code == "INDUSTRIE" ||
          this.corporate.activitySector.code == "CONSTRUCTION" ||	this.corporate.activitySector.code == "SERVICES"){
            this.scoreActivitySector = 5 ;
          }else if (this.corporate.activitySector.code == "BANQUE" ||	this.corporate.activitySector.code == "ASSURANCE" ||
            this.corporate.activitySector.code == "IMMOBILIER") {
              this.scoreActivitySector = 10 ;
          } else if (this.corporate.activitySector.code == "ENTREPRENEURSHIP" || this.corporate.activitySector.code == "PUBLIC SERVICES"){
            this.scoreActivitySector = 15;
          }	
        }else{
          this.scoreActivitySector = 0;
        }
        //score avec ponderation
        this.scoreActivitySector = this.scoreActivitySector * 0.40;
  
  
        // Rubrique Client/ Financement
  
        //Score revenue
        if(this.retail.revenu != null){
          if(this.retail.revenu <= 2000)
            this.scoreRevenu = 5 ;
          else if (this.retail.revenu > 2000 && this.retail.revenu <= 4000)
            this.scoreRevenu = 10 ;
          else if (this.retail.revenu > 4000 && this.retail.revenu <= 8000)
            this.scoreRevenu = 15 ;
          else
            this.scoreRevenu = 20 ;
        }
        //score avec ponderation
        this.scoreRevenu = this.scoreRevenu * 0.3;
  
  
        //Score statut emploi
        if(this.retail.employementStatus != null ){
          if(this.retail.employementStatus == EmployementStatus.CDI )
            this.scoreEmploymentstatus = 20 ;
          else if (this.retail.employementStatus == EmployementStatus.CDD) 
            this.scoreEmploymentstatus = 10 ;
          else if ( this.retail.employementStatus == EmployementStatus.RETRAITE) 
            this.scoreEmploymentstatus = 15 ;
          else if (this.retail.employementStatus == EmployementStatus.TRAVAILLEUR_INDEPENDANT || this.retail.employementStatus == EmployementStatus.AUTRES)
            this.scoreEmploymentstatus = 0 ;
          else
            this.scoreEmploymentstatus = 0 ;
        }
        //score avec ponderation
        this.scoreEmploymentstatus = this.scoreEmploymentstatus * 0.15;
  
        // score family situation
        if(this.retail.familySituation != null ){
          if(this.retail.familySituation == FamilySituation.CELIBATAIRE)
            this.scoreSituationFamille = 20 ;
          else if (this.retail.familySituation == FamilySituation.MARIE)
            this.scoreSituationFamille = 15 ;
          else if (this.retail.familySituation == FamilySituation.VEUF)
            this.scoreSituationFamille = 10 ;
          else if (this.retail.familySituation == FamilySituation.DIVORCE)
            this.scoreSituationFamille = 10 ;
        }
        //score avec ponderation
        this.scoreSituationFamille = this.scoreSituationFamille * 0.05;
  
        //  score nb personne a charge
        if(this.retail.nbrDependents !=null){
          if(this.retail.nbrDependents >=0&& this.retail.nbrDependents <= 2)
            this.scoreNbrDependents = 20 ;
          else if (this.retail.nbrDependents >2 && this.retail.nbrDependents <=  5)
            this.scoreNbrDependents = 15 ;
          else if (this.retail.nbrDependents >5 && this.retail.nbrDependents <= 7)
            this.scoreNbrDependents = 10 ;
          else if (this.retail.nbrDependents >7 )
            this.scoreNbrDependents = 5 ;
        }
        //score avec ponderation
        this.scoreNbrDependents = this.scoreNbrDependents * 0.05;
  
  
        //Score Taux Endettement
        if(this.retail.deptRatio != null){
          if(this.retail.deptRatio < 30)
            this.scoreTauxEndettement = 20 ;
          else if (this.retail.deptRatio >= 30 && this.retail.deptRatio < 40)
            this.scoreTauxEndettement = 15 ;
          else if (this.retail.deptRatio >= 40 && this.retail.deptRatio < 45)
            this.scoreTauxEndettement = 10 ;
          else
            this.scoreTauxEndettement = 5 ;
        }
        //score avec ponderation
        this.scoreTauxEndettement = this.scoreTauxEndettement * 0.25;
  
        //Score ancienneté avec la banque
        if(this.retail.seniorityRelation != null){
          if(this.retail.seniorityRelation  <= 1 )
            this.scoreAncienneteRelationBanque = 0 ;
          else if(this.retail.seniorityRelation > 1 && this.retail.seniorityRelation <=2 )
            this.scoreAncienneteRelationBanque = 5 ;
          else if(this.retail.seniorityRelation > 2 && this.retail.seniorityRelation <=5)
            this.scoreAncienneteRelationBanque = 10 ;
          else if(this.retail.seniorityRelation > 5 && this.retail.seniorityRelation <=10)
            this.scoreAncienneteRelationBanque = 15 ;
          else if(this.retail.seniorityRelation > 10)
            this.scoreAncienneteRelationBanque = 20 ;
        }
        //score avec ponderation
        this.scoreAncienneteRelationBanque = this.scoreAncienneteRelationBanque * 0.10;
  
        //Score age
        if(this.retail.age != null){
          if(this.retail.age < 30)
            this.scoreAgeRetail = 5 ;
          else if (this.retail.age >= 30 && this.retail.age < 40)
            this.scoreAgeRetail = 10 ;
          else if (this.retail.age >= 40 && this.retail.age < 50)
            this.scoreAgeRetail = 15 ;
          else
            this.scoreAgeRetail = 15 ;
        }
        //score avec ponderation
        this.scoreAgeRetail = this.scoreAgeRetail * 0.10;
  
  
        // Comportement                     
  
        //Score presence impayé
        if(this.retail.unpaidPresence != null){
          if(this.retail.unpaidPresence = "Aucun impayé")
            this.scorePresenceImpaye = 20 ;
          else if (this.retail.unpaidPresence =="impayé inf 2 mois")
            this.scorePresenceImpaye = 15 ;
          else if (this.retail.unpaidPresence=="impayé sup 2 mois")
            this.scorePresenceImpaye = 5 ;
          else if (this.retail.unpaidPresence=="impayé sup 3 mois")
            this.scorePresenceImpaye = 0 ;
        }
        //score avec ponderation
        this.scorePresenceImpaye = this.scorePresenceImpaye * 0.60;
  
  
        //Score incident de payement
        if(this.retail.payementIncident != null){
          if(this.retail.payementIncident = "Aucun incident")
            this.scoreIncidentPayement = 20 ;
          else if (this.retail.payementIncident =="incident de paiement sur cheque")
            this.scoreIncidentPayement = 0 ;
        }
        //score avec ponderation
        this.scoreIncidentPayement = this.scoreIncidentPayement * 0.40;
  
        //Calcul  score Employeur contre partie 
        this.scoreEmployeur =( this.scoreEmployerSize + this.scoreAncienneteEmployeur +this.scoreActivitySector ) *0.40;
  
        //Calcul  score Client / financement
        this.scoreClient = (this.scoreAgeRetail + this.scoreAncienneteRelationBanque + this.scoreTauxEndettement +
        this.scoreNbrDependents +this.scoreSituationFamille + this.scoreEmploymentstatus +	this.scoreRevenu ) * 0.30;
  
        //Calcul  score Comportement client 
        this.scoreComportement = (this.scorePresenceImpaye + this.scoreIncidentPayement) * 0.30;
  
  
        this.clientNotation.finalScore = this.scoreEmployeur + this.scoreClient + this.scoreComportement ; 
        this.clientNotation.adjustedScore = ((Number(this.clientNotation.finalScore|| 0) -10 )*10) /10;
        this.scoreProbabiliste = 1/ ( 1 + Math.exp( - (this.clientNotation.adjustedScore)));
  
        this.clientNotation.pd = 1 -this.scoreProbabiliste;
  
        if(Number(this.clientNotation.pd)  >= 0  && Number(this.clientNotation.pd) <=  0.1){
          this.clientNotation.decisionOctroi = Decision.Excellente ;
        }else if (Number(this.clientNotation.pd)  >0.1 && Number(this.clientNotation.pd) <=  0.2){
          this.clientNotation.decisionOctroi = Decision.Bonne ;
        }else if (Number(this.clientNotation.pd)  >0.2 && Number(this.clientNotation.pd) <=  0.3){
          this.clientNotation.decisionOctroi = Decision.Moyenne ;
        }else {
          this.clientNotation.decisionOctroi = Decision.Mauvaise ;
        }
  
        if(Number(this.clientNotation.pd)  >= 0  && Number(this.clientNotation.pd) <=  0.1){
          this.clientNotation.classe = Classe.A ;
        }else if (Number(this.clientNotation.pd)  >0.1 && Number(this.clientNotation.pd) <=  0.2){
          this.clientNotation.classe = Classe.B ;
        }else if (Number(this.clientNotation.pd)  >0.2 && Number(this.clientNotation.pd) <=  0.3){
          this.clientNotation.classe = Classe.C ;
        }else {
          this.clientNotation.classe = Classe.D ;
        }
  
        this.clientNotation.notationDate = new Date();
        //this.clientNotation.id = clientNotation.id || 0;
        console.log("586 this.clientNotation.id = "+this.clientNotation.id);
  
        this.clientSegmentConfigService.getClientSegmentConfigByCode("PARTICULIERS").subscribe(
          res=>{
            this.clientSegmentConfig = res;
              if (this.clientNotation && this.clientSegmentConfig) {
              this.clientNotation.clientSegmentConfig = this.clientSegmentConfig;
              console.log(this.clientNotation.clientSegmentConfig.segmentCode);
            } else {
              console.log("clientNotation ou clientSegmentConfig est null");
            }
            if(this.clientNotation.clientSegmentConfig !=null)
              console.log(this.clientNotation.clientSegmentConfig.segmentCode);
            /*
            this.corporate.clientNotation = this.clientNotation;
            */
            this.clientNotation.scoringContractData = this.retail;
      
            console.log("this.clientNotation.scoringContractData = "+this.clientNotation.scoringContractData);
            console.log("596 this.clientNotation.id = " + this.clientNotation.id);
            console.log("this.retail.clientNotation.id = " + this.retail.clientNotation?.id);
    
      
            this.clientNotationService.editClientNotation(this.clientNotation).subscribe(
              res=>{
                console.log("edit ClientNOtation"+res);
                this.retail.clientNotation = this.clientNotation ; 
              }, 
              err=>{
                console.log(err);
              }
            ); 
          }, err=>{
            console.log(err);
          }
        ); 
  
        
        
      },err=>{
        console.log(err);
      }
    );
  
  
    this.isScored = true ;
    this.toast.success( "Calcul effectué avec succes !" );
    // Forcer la détection des changements
    //this.cdr.detectChanges();
  
    //this.retail.clientNotation = this.clientNotation;
  }

  
  
}

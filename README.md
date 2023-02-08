## Full-Auto (FixBuffer)
```plantuml
@startuml

[*]-->null: initial
null: - Initial state, "" in DB
null: - **UnloadComplete**, no FOUP on LP

null-[#green]->ReadyToLoad: LoadRequest
ReadyToLoad: Loadport empty, ready to put on FOUP

ReadyToLoad-[#green]->ReservedToLoad: Transport command send success \n(MES->MCS)
ReservedToLoad: MCS transport Job created, wait FOUP arrive
ReservedToLoad: **Full-Auto only**

ReservedToLoad-[#red]->ReadyToLoad: Transport command cancel/abort/changeDestination \n(MCS->MES)

ReservedToLoad-[#green]->ReadyToProcess: LoadComplete
ReadyToProcess: FOUP arrived on Loadport
ReadyToProcess: **LoadComplete**

ReadyToProcess-[#green]->ReadyToUnload: UnloadRequest
ReadyToUnload: FOUP needs to leave Loadport

ReadyToUnload-[#green]->ReservedToUnload: Transport command send success \n(MES->MCS)
ReservedToUnload: MCS transport Job created, wait FOUP leave
ReservedToUnload: **Full-Auto only**

ReservedToUnload-[#red]->ReadyToUnload: Transport command cancel/abort \n(MCS->MES)
ReservedToUnload-[#green]->null: UnloadComplete

ReservedToUnload-[#orange,bold]->ReadyToLoad: LoadRequest (Full-Auto)
note on link
	- LoadRequest and Unload events too close
	- MES receive LoadRequest 
	earlier than UnloadComplete
end note

state ReadyToLoad #pink
state ReadyToUnload #pink
state ReadyToProcess #pink
state null #pink
@enduml
```

## Semi-Auto (FixBuffer)
```plantuml
@startuml

[*]-->null: initial
null: - Initial state, "" in DB
null: - **UnloadComplete**, no FOUP on LP

null-[#green]->ReadyToLoad: LoadRequest
ReadyToLoad: Loadport empty, ready to put on FOUP

ReadyToLoad-[#green]->ReadyToProcess: LoadComplete
ReadyToProcess: FOUP arrived on Loadport
ReadyToProcess: **LoadComplete**


ReadyToProcess-[#green]->ReadyToUnload: UnloadRequest
ReadyToUnload: FOUP needs to leave Loadport

ReadyToUnload-[#green]->null: UnloadComplete

ReadyToUnload-[#orange,bold]->ReadyToLoad: LoadRequest (Semi-Auto)
note on link
	- LoadRequest and Unload events too close
	- MES receive LoadRequest 
	earlier than UnloadComplete
end note

state ReadyToLoad #pink
state ReadyToUnload #pink
state ReadyToProcess #pink
state null #pink
@enduml
```


## Full-Auto (InternalBuffer)
#TODO

```plantuml
@startuml

[*]-->null: initial
null: - Initial state, "" in DB
null: - **UnloadComplete**, no FOUP on LP

null-[#green]->ReadyToLoad: LoadRequest
ReadyToLoad: Loadport empty, ready to put on FOUP

ReadyToLoad-[#green]->ReservedToLoad: Transport command send success \n(MES->MCS)
ReservedToLoad: MCS transport Job created, wait FOUP arrive
ReservedToLoad: **Full-Auto only**

ReservedToLoad-[#red]->ReadyToLoad: Transport command cancel/abort/changeDestination \n(MCS->MES)

ReservedToLoad-[#green]->ReadyToProcess: LoadComplete
ReadyToProcess: FOUP arrived on Loadport
ReadyToProcess: **LoadComplete**

ReadyToProcess-[#green]->ReadyToUnload: UnloadRequest
ReadyToProcess-[#green]->ReadyToLoad: LoadRequest
ReadyToUnload: FOUP needs to leave Loadport

ReadyToUnload-[#green]->ReservedToUnload: Transport command send success \n(MES->MCS)
ReservedToUnload: MCS transport Job created, wait FOUP leave
ReservedToUnload: **Full-Auto only**

ReservedToUnload-[#red]->ReadyToUnload: Transport command cancel/abort \n(MCS->MES)
ReservedToUnload-[#green]->null: UnloadComplete

ReservedToUnload-[#orange,bold]->ReadyToLoad: LoadRequest (Full-Auto)
note on link
	- LoadRequest and Unload events too close
	- MES receive LoadRequest 
	earlier than UnloadComplete
end note

state ReadyToLoad #pink
state ReadyToUnload #pink
state ReadyToProcess #pink
state null #pink
@enduml
```
## Semi-Auto (InternalBuffer)

```plantuml
@startuml

[*]-->null: initial
null: - Initial state, "" in DB
null: - **UnloadComplete**, no FOUP on LP

null-[#green]->ReadyToLoad: LoadRequest
ReadyToLoad: Loadport empty, ready to put on FOUP

ReadyToLoad-[#green]->ReadyToProcess: LoadComplete
ReadyToProcess: FOUP arrived on Loadport
ReadyToProcess: **LoadComplete**


ReadyToProcess-[#green]->ReadyToUnload: UnloadRequest
ReadyToProcess-[#green]->ReadyToLoad: LoadRequest
ReadyToUnload: FOUP needs to leave Loadport

ReadyToUnload-[#green]->null: UnloadComplete

ReadyToUnload-[#orange,bold]->ReadyToLoad: LoadRequest (Semi-Auto)
note on link
	- LoadRequest and Unload events too close
	- MES receive LoadRequest 
	earlier than UnloadComplete
end note

state ReadyToLoad #pink
state ReadyToUnload #pink
state ReadyToProcess #pink
state null #pink
@enduml
```

# State description
| State            | Description                                              |
|:---------------- |:-------------------------------------------------------- |
| null             | Initial state, UnloadComplete                                            |
| ReadyToLoad      | Loadport empty, wait put on FOUP                         |
| ReservedToLoad   | MCS job to put on FOUP created.<div>Wait AMHS</div>      |
| ReadyToProcess   | FOUP already on Loadport.<div>Wait Process</div>         |
| ReadyToUnload    | Wafer process completed, wait to be removed fromLoadport |
| ReservedToUnload | MCS job to remove FOUP created.<div>Wait AMHS</div>      |
 

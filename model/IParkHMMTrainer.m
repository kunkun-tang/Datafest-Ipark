%%%
clc, clear all;

load observationData.dot %source data

seq=observationData(:,4)'+1; %hourly time 
states=observationData(:,5)'+1; %state of occupation

[TRANS_EST, EMIS_EST] = hmmestimate(seq(1:10000), states(1:10000));
%use first 10000 data to train an HMM model

[PSTATES,logpseq] = hmmdecode(seq(10001:15000),TRANS_EST,EMIS_EST);
%use other 5000 data to train an HMM model

[tmp,states_EST]=max(PSTATES);
corrects=sum(states(10001:15000)==states_EST);
correctRate=corrects/5000


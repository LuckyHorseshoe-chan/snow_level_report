import {
    Step,
    StepDescription,
    StepIcon,
    StepIndicator,
    StepNumber,
    StepSeparator,
    StepStatus,
    StepTitle,
    Stepper,
    useSteps,
    Box
  } from '@chakra-ui/react'

function Menu({activeStep, setActiveStep} : {activeStep: any, setActiveStep: any}){
    const steps = [
        { title: 'Upload', onClick: () => setActiveStep(0) },
        { title: 'Validation', onClick: () => setActiveStep(1) },
        { title: 'Report', onClick: () => setActiveStep(2) },
    ]

    return(
        <div id="menu">
            <Stepper index={activeStep}>
            {steps.map((step, index) => (
                <Step key={index} onClick={step.onClick}>
                <StepIndicator>
                    <StepStatus
                    complete={<StepIcon />}
                    incomplete={<StepNumber />}
                    active={<StepNumber />}
                    />
                </StepIndicator>

                <Box flexShrink='0'>
                    <StepTitle>{step.title}</StepTitle>
                </Box>

                <StepSeparator />
                </Step>
            ))}
            </Stepper>
        </div>
    )
}
export default Menu;